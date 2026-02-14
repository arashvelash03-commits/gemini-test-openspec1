import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

const ALLOWED_STAFF_ROLES = ["clerk"] as const;

export const staffRouter = router({
  getMyStaff: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.session.user.role !== "doctor") {
        throw new Error("Unauthorized");
      }

      const myStaff = await db.select({
        id: users.id,
        fullName: users.fullName,
        nationalCode: users.nationalCode,
        phoneNumber: users.phoneNumber,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.createdBy, ctx.session.user.id))
      .orderBy(desc(users.createdAt));

      return myStaff;
    }),

  createStaff: protectedProcedure
    .input(z.object({
      fullName: z.string().min(3),
      nationalCode: z.string().length(10),
      phoneNumber: z.string().min(10),
      role: z.enum(ALLOWED_STAFF_ROLES),
      password: z.string().min(6),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      birthDate: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "doctor") {
        throw new Error("Unauthorized");
      }

      // Unique check (globally unique national code)
      const existingUser = await db.query.users.findFirst({
        where: eq(users.nationalCode, input.nationalCode),
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
        resourceType: "Practitioner", // FHIR compliance: Staff are Practitioners
        status: "active",
        createdBy: ctx.session.user.id,
        gender: input.gender,
        birthDate: input.birthDate ? input.birthDate : null,
      });

      return { success: true };
    }),

  updateStaff: protectedProcedure
    .input(z.object({
      id: z.string(),
      fullName: z.string().min(3),
      nationalCode: z.string().length(10),
      phoneNumber: z.string().min(10),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "doctor") {
        throw new Error("Unauthorized");
      }

      // Ensure ownership
      const existingStaff = await db.query.users.findFirst({
        where: and(eq(users.id, input.id), eq(users.createdBy, ctx.session.user.id)),
      });

      if (!existingStaff) {
        throw new Error("Staff not found or access denied");
      }

      // Unique check for national code (if changed)
      if (input.nationalCode !== existingStaff.nationalCode) {
          const duplicate = await db.query.users.findFirst({
              where: eq(users.nationalCode, input.nationalCode),
          });
          if (duplicate) {
              throw new Error("کد ملی وارد شده تکراری است");
          }
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

  toggleStaffStatus: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.role !== "doctor") {
        throw new Error("Unauthorized");
      }

      const staff = await db.query.users.findFirst({
          where: and(eq(users.id, input.id), eq(users.createdBy, ctx.session.user.id)),
      });

      if (!staff) throw new Error("Staff not found or access denied");

      const newStatus = staff.status === "active" ? "inactive" : "active";

      await db.update(users)
        .set({ status: newStatus })
        .where(eq(users.id, input.id));

      return { success: true };
    }),
});
