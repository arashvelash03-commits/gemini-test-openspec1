import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { TRPCError } from "@trpc/server";
import { encrypt, decrypt } from "@/lib/encryption";

export const totpRouter = router({
  generateTotpSecret: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (user.totpEnabled) {
          // If already enabled, returning null or special status might be better,
          // but strictly speaking we shouldn't be generating a secret.
          // For the frontend to handle this gracefully:
          return { secret: null, qrCodeUrl: null, alreadyEnabled: true };
      }

      let secret = user.totpSecret ? decrypt(user.totpSecret) : null;

      // If no secret exists, or if we want to ensure a secret exists for setup
      if (!secret) {
          secret = authenticator.generateSecret();
          const encryptedSecret = encrypt(secret);
          // Save secret to DB (enabled=false until verified)
          await db
            .update(users)
            .set({ totpSecret: encryptedSecret, totpEnabled: false })
            .where(eq(users.id, user.id));
      }

      // Re-generate QR code for the (existing or new) secret
      const otpauth = authenticator.keyuri(
        user.nationalCode,
        "GeminiTest",
        secret
      );

      const qrCodeUrl = await QRCode.toDataURL(otpauth);

      return { secret, qrCodeUrl, alreadyEnabled: false };
    }),

  verifyAndEnableTotp: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });

      if (!user || !user.totpSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "TOTP setup not initiated",
        });
      }

      const secret = decrypt(user.totpSecret);
      const isValid = authenticator.check(token, secret);

      if (!isValid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token" });
      }

      await db
        .update(users)
        .set({ totpEnabled: true })
        .where(eq(users.id, user.id));

      return { success: true };
    }),
});
