import NextAuth, { CredentialsSignin } from "next-auth";
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

class TotpRequiredError extends CredentialsSignin {
  constructor() {
    super("TOTP_REQUIRED");
    this.code = "TOTP_REQUIRED";
  }
}

class InvalidTotpError extends CredentialsSignin {
  constructor() {
    super("INVALID_TOTP");
    this.code = "INVALID_TOTP";
  }
}

class TotpSetupError extends CredentialsSignin {
  constructor() {
    super("TOTP_SETUP_ERROR");
    this.code = "TOTP_SETUP_ERROR";
  }
}

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
        const parsedCredentials = await signInSchema.safeParseAsync(credentials);

        if (!parsedCredentials.success) {
            return null;
        }

        const { identifier, password, totpCode } = parsedCredentials.data;

        try {
          const user = await db.query.users.findFirst({
            where: or(
              eq(users.phoneNumber, identifier),
              eq(users.nationalCode, identifier)
            ),
          });

          if (!user || !user.passwordHash) return null;

          const passwordMatch = await bcrypt.compare(password, user.passwordHash);
          if (!passwordMatch) return null;

          if (user.totpEnabled) {
            if (!totpCode || totpCode.trim() === "" || totpCode === "undefined" || totpCode === "null") {
              throw new TotpRequiredError();
            }
            if (!user.totpSecret) throw new TotpSetupError();

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) {
                throw new InvalidTotpError();
            }
          }

          return {
            id: user.id,
            name: user.fullName,
            role: user.role,
            totpEnabled: user.totpEnabled || false,
          };
        } catch (error) {
           if (error instanceof CredentialsSignin) {
               throw error;
           }
           // Fallback to null for unknown errors to prevent crashing
           console.error("Authorize error:", error);
           return null;
        }
      },
    }),
  ],
  // Standard logging configuration if needed, generally default is fine for dev
});
