import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authenticator } from "otplib";

const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  totpCode: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Phone or National Code", type: "text" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "TOTP Code", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const { identifier, password, totpCode } = await signInSchema.parseAsync(credentials);

          const user = await db.query.users.findFirst({
            where: or(
              eq(users.phoneNumber, identifier),
              eq(users.nationalCode, identifier)
            ),
          });

          if (!user) {
            return null;
          }

          if (!user.passwordHash) {
             return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.passwordHash);

          if (!passwordMatch) {
            return null;
          }

          if (user.totpEnabled) {
            if (!totpCode) {
              throw new Error("TOTP_REQUIRED");
            }

            if (!user.totpSecret) {
               throw new Error("TOTP_SETUP_ERROR");
            }

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) {
              throw new Error("INVALID_TOTP");
            }
          }

          return {
            id: user.id,
            name: user.fullName,
            role: user.role,
            totpEnabled: user.totpEnabled || false,
          };
        } catch (error) {
          if (error instanceof Error &&
             (error.message === "TOTP_REQUIRED" || error.message === "INVALID_TOTP" || error.message === "TOTP_SETUP_ERROR")) {
             throw error;
          }
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
  ],
  logger: {
    error(code, ...message) {
      if (code.name === 'CredentialsSignin') {
        return;
      }
      console.error(code, ...message);
    },
  },
});
