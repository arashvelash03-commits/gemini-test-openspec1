import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users, auditLogs } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logAudit } from "../services/audit";

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
      });

      if (existingUser) {
        throw new Error("کاربری با این کد ملی وجود دارد");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const [newUser] = await db.insert(users).values({
        fullName: input.fullName,
        nationalCode: input.nationalCode,
        phoneNumber: input.phoneNumber,
        role: input.role,
        passwordHash: hashedPassword,
        resourceType: "Practitioner",
        status: "active",
        createdBy: ctx.session.user.id, // Fill createdBy
        gender: input.gender,
        birthDate: input.birthDate ? input.birthDate : null,
      }).returning({ id: users.id });

      // Audit Log
      await logAudit(ctx, {
        action: "create_user",
        resourceType: "user",
        resourceId: newUser.id,
        details: { role: input.role, nationalCode: input.nationalCode },
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

      // Audit Log
      await logAudit(ctx, {
        action: "update_user",
        resourceType: "user",
        resourceId: input.id,
        details: { changedFields: ["fullName", "nationalCode", "phoneNumber"] },
      });

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
      });

      if (!user) throw new Error("User not found");

      const newStatus = user.status === "active" ? "inactive" : "active";

      await db.update(users)
        .set({ status: newStatus })
        .where(eq(users.id, input.id));

      // Audit Log
      await logAudit(ctx, {
        action: "toggle_user_status",
        resourceType: "user",
        resourceId: input.id,
        details: { oldStatus: user.status, newStatus },
      });

      return { success: true };
    }),

  getAuditLogs: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
    }).default({ page: 1, limit: 50 }))
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        db.select({
          id: auditLogs.id,
          action: auditLogs.action,
          resourceType: auditLogs.resourceType,
          resourceId: auditLogs.resourceId,
          details: auditLogs.details,
          actorDetails: auditLogs.actorDetails,
          ipAddress: auditLogs.ipAddress,
          occurredAt: auditLogs.occurredAt,
          actorName: users.fullName, // Fallback from join
          actorRole: users.role,     // Fallback from join
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorUserId, users.id))
        .orderBy(desc(auditLogs.occurredAt))
        .limit(limit)
        .offset(offset),

        db.select({ count: sql<number>`count(*)` })
          .from(auditLogs)
          .then(res => Number(res[0].count))
      ]);

      return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
});
