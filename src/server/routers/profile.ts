import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const profileRouter = router({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new Error("User not found");
      }

      return {
        fullName: user.fullName,
        nationalCode: user.nationalCode,
        phoneNumber: user.phoneNumber,
        totpEnabled: user.totpEnabled,
      };
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      fullName: z.string().optional(),
      nationalCode: z.string().optional(),
      phoneNumber: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.update(users)
        .set({
          fullName: input.fullName,
          nationalCode: input.nationalCode,
          phoneNumber: input.phoneNumber,
        })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user || !user.passwordHash) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new Error("کلمه عبور فعلی اشتباه است");
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await db.update(users)
        .set({ passwordHash: hashedPassword })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),

  reset2FA: protectedProcedure
    .mutation(async ({ ctx }) => {
        await db.update(users)
            .set({ totpEnabled: false, totpSecret: null })
            .where(eq(users.id, ctx.session.user.id));
        return { success: true };
    }),
});
