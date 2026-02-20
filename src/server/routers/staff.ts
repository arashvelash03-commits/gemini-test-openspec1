import { router, doctorProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { logAudit } from "../services/audit";

const ALLOWED_STAFF_ROLES = ["clerk"] as const;

export const staffRouter = router({
  getMyStaff: doctorProcedure
    .query(async ({ ctx }) => {
      // Role check is handled by doctorProcedure middleware

      const myStaff = await db.select({
        id: users.id,
        fullName: users.fullName,
        nationalCode: users.nationalCode,
        phoneNumber: users.phoneNumber,
        role: users.role,
        status: users.status,
        gender: users.gender,
        birthDate: users.birthDate,
      })
      .from(users)
      .where(eq(users.createdBy, ctx.session.user.id))
      .orderBy(desc(users.createdAt));

      return myStaff;
    }),

  createStaff: doctorProcedure
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
      // Role check is handled by doctorProcedure middleware

      // Unique check (globally unique national code)
      const existingUser = await db.query.users.findFirst({
        where: eq(users.nationalCode, input.nationalCode),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "کاربری با این کد ملی وجود دارد",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const [newStaff] = await db.insert(users).values({
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
      }).returning({ id: users.id });

      // Audit Log
      await logAudit(ctx, {
        action: "create_staff",
        resourceType: "user",
        resourceId: newStaff.id,
        details: { role: input.role, nationalCode: input.nationalCode, createdBy: ctx.session.user.id },
      });

      return { success: true };
    }),

  updateStaff: doctorProcedure
    .input(z.object({
      id: z.string(),
      fullName: z.string().min(3),
      nationalCode: z.string().length(10),
      phoneNumber: z.string().min(10),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      birthDate: z.string().optional(),
      password: z.string().min(6).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Role check is handled by doctorProcedure middleware

      // Ensure ownership
      const existingStaff = await db.query.users.findFirst({
        where: and(eq(users.id, input.id), eq(users.createdBy, ctx.session.user.id)),
      });

      if (!existingStaff) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Staff not found or access denied",
        });
      }

      // Unique check for national code (if changed)
      if (input.nationalCode !== existingStaff.nationalCode) {
          const duplicate = await db.query.users.findFirst({
              where: eq(users.nationalCode, input.nationalCode),
          });
          if (duplicate) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "کد ملی وارد شده تکراری است",
              });
          }
      }

      const updateData: any = {
        fullName: input.fullName,
        nationalCode: input.nationalCode,
        phoneNumber: input.phoneNumber,
        gender: input.gender,
        birthDate: input.birthDate ? input.birthDate : null,
      };

      if (input.password) {
        updateData.passwordHash = await bcrypt.hash(input.password, 10);
      }

      await db.update(users)
        .set(updateData)
        .where(eq(users.id, input.id));

      // Audit Log
      await logAudit(ctx, {
        action: "update_staff",
        resourceType: "user",
        resourceId: input.id,
        details: { changedFields: Object.keys(updateData) },
      });

      return { success: true };
    }),

  toggleStaffStatus: doctorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Role check is handled by doctorProcedure middleware

      const staff = await db.query.users.findFirst({
          where: and(eq(users.id, input.id), eq(users.createdBy, ctx.session.user.id)),
      });

      if (!staff) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Staff not found or access denied",
        });
      }

      const newStatus = staff.status === "active" ? "inactive" : "active";

      await db.update(users)
        .set({ status: newStatus })
        .where(eq(users.id, input.id));

      // Audit Log
      await logAudit(ctx, {
        action: "toggle_staff_status",
        resourceType: "user",
        resourceId: input.id,
        details: { oldStatus: staff.status, newStatus },
      });

      return { success: true };
    }),
});
