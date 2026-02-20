import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const adminRouter = router({
  getUsers: protectedProcedure
    .input(z.object({}).optional()) // Allow optional empty input to match frontend call if needed
    .query(async ({ ctx }) => {
      // Basic RBAC check
      if (ctx.session.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const allUsers = await db.select({
        id: users.id,
        fullName: users.fullName,
        nationalCode: users.nationalCode,
        phoneNumber: users.phoneNumber,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

      return allUsers;
    }),

  createUser: protectedProcedure
    .input(z.object({
      fullName: z.string().min(3),
      nationalCode: z.string().length(10),
      phoneNumber: z.string().min(10),
      role: z.enum(["doctor", "clerk"]),
      password: z.string().min(6),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      birthDate: z.string().optional(), // Receive as string, convert to Date
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.nationalCode, input.nationalCode),
        columns: { id: true },
      });

      if (existingUser) {
        throw new Error("کاربری با این کد ملی وجود دارد");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await db.insert(users).values({
        fullName: input.fullName,
        nationalCode: input.nationalCode,
        phoneNumber: input.phoneNumber,
        role: input.role,
        passwordHash: hashedPassword,
        resourceType: "Practitioner",
        status: "active",
        createdBy: ctx.session.user.id, // Fill createdBy
        gender: input.gender,
        birthDate: input.birthDate // Assuming string date is compatible or needs "new Date()"
          ? input.birthDate // drizzle-orm date mode="date" expects string YYYY-MM-DD usually, but let's check
          : null,
      });

      return { success: true };
    }),

  updateUser: protectedProcedure
    .input(z.object({
      id: z.string(),
      fullName: z.string().min(3),
      nationalCode: z.string().length(10),
      phoneNumber: z.string().min(10),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(users.nationalCode, input.nationalCode),
        columns: { id: true },
      });

      if (existingUser && existingUser.id !== input.id) {
        throw new Error("کد ملی وارد شده تکراری است");
      }

      await db.update(users)
        .set({
          fullName: input.fullName,
          nationalCode: input.nationalCode,
          phoneNumber: input.phoneNumber,
        })
        .where(eq(users.id, input.id));

      return { success: true };
    }),

  deactivateUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const user = await db.query.users.findFirst({
          where: eq(users.id, input.id),
          columns: { status: true },
      });

      if (!user) throw new Error("User not found");

      const newStatus = user.status === "active" ? "inactive" : "active";

      await db.update(users)
        .set({ status: newStatus })
        .where(eq(users.id, input.id));

      return { success: true };
    }),
});
