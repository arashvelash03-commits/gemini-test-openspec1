import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authenticator } from "otplib";

// Allow for some clock drift (30s window by default)
authenticator.options = { window: 1 };

const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  totpCode: z.string().optional(),
});

class TotpSetupRequiredError extends CredentialsSignin {
  constructor() {
    super("TOTP_SETUP_REQUIRED");
    this.code = "TOTP_SETUP_REQUIRED";
  }
}

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

          // To prevent user enumeration attacks, we'll use a dummy hash if the user is not found.
          // This ensures that the bcrypt.compare function takes a similar amount of time for both
          // existing and non-existing users.
          const passwordHash = user?.passwordHash ?? "$2a$10$GN3s.dG.E2N5b2w/1s5k.uN0J0s5g5g5g5g5g5g5g5g5g5g5g5g5g";
          const passwordMatch = await bcrypt.compare(password, passwordHash);

          if (!user || !passwordMatch) {
            return null;
          }

          if (user.totpEnabled) {
            if (!user.totpSecret) {
              throw new TotpSetupRequiredError();
            }
            if (!totpCode || totpCode.trim() === "" || totpCode === "undefined" || totpCode === "null") {
              throw new TotpRequiredError();
            }

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
