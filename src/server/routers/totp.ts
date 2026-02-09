import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { TRPCError } from "@trpc/server";

export const totpRouter = router({
  generateTotpSecret: publicProcedure
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input }) => {
      const { identifier } = input;
      const user = await db.query.users.findFirst({
        where: or(
          eq(users.phoneNumber, identifier),
          eq(users.nationalCode, identifier)
        ),
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(
        user.nationalCode, // Use national code as username in Authenticator
        "GeminiTest",
        secret
      );

      // Save secret to DB (enabled=false until verified)
      await db
        .update(users)
        .set({ totpSecret: secret, totpEnabled: false })
        .where(eq(users.id, user.id));

      const qrCodeUrl = await QRCode.toDataURL(otpauth);

      return { secret, qrCodeUrl };
    }),

  verifyAndEnableTotp: publicProcedure
    .input(z.object({ identifier: z.string(), token: z.string() }))
    .mutation(async ({ input }) => {
      const { identifier, token } = input;
      const user = await db.query.users.findFirst({
        where: or(
          eq(users.phoneNumber, identifier),
          eq(users.nationalCode, identifier)
        ),
      });

      if (!user || !user.totpSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "TOTP setup not initiated",
        });
      }

      const isValid = authenticator.check(token, user.totpSecret);

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
