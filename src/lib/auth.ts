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

// Custom Error Classes for specific, self-documenting error handling
class InvalidCredentialsError extends CredentialsSignin {
  constructor() {
    super("INVALID_CREDENTIALS");
    this.code = "INVALID_CREDENTIALS";
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
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { identifier, password, totpCode } = parsedCredentials.data;

        try {
          const user = await db.query.users.findFirst({
            where: or(
              eq(users.phoneNumber, identifier),
              eq(users.nationalCode, identifier)
            ),
          });

          // SECURITY: Constant-time comparison to prevent user enumeration.
          // 1. If user not found, create a dummy hash to compare against.
          // 2. If user found, use their actual hash.
          const hashToCompare = user?.passwordHash ?? await bcrypt.hash("dummyPassword", 10);
          const passwordMatch = await bcrypt.compare(password, hashToCompare);

          if (!user || !passwordMatch) {
            throw new InvalidCredentialsError();
          }

          // Handle TOTP verification
          if (user.totpEnabled) {
            if (!totpCode) {
              throw new TotpRequiredError();
            }
            if (!user.totpSecret) {
              // This case indicates a server-side configuration issue.
              console.error(`User ${user.id} has TOTP enabled but no secret.`);
              throw new TotpSetupError();
            }

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) {
              throw new InvalidTotpError();
            }
          }

          // Return a safe user object for the session
          return {
            id: user.id,
            name: user.fullName,
            role: user.role,
            totpEnabled: user.totpEnabled ?? false,
          };
        } catch (error) {
          if (error instanceof CredentialsSignin) {
            // Re-throw custom auth errors to be caught by the UI
            throw error;
          }
          // Log unexpected errors and throw a generic credentials error
          console.error("Authorize error:", error);
          throw new InvalidCredentialsError();
        }
      },
    }),
  ],
});
