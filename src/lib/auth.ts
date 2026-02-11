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
    super("TOTP_REQUIRED"); // Message
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
        try {
          const { identifier, password, totpCode } = await signInSchema.parseAsync(credentials);

          console.log(`Authorize called for ${identifier}.`);

          const user = await db.query.users.findFirst({
            where: or(
              eq(users.phoneNumber, identifier),
              eq(users.nationalCode, identifier)
            ),
          });

          if (!user) return null;
          if (!user.passwordHash) return null;

          const passwordMatch = await bcrypt.compare(password, user.passwordHash);
          if (!passwordMatch) return null;

          if (user.totpEnabled) {
            // Check for undefined, null, empty string, or "undefined" string explicitly
            if (!totpCode || totpCode === "undefined" || totpCode === "null" || totpCode.trim() === "") {
              console.log("Throwing TOTP_REQUIRED");
              throw new TotpRequiredError();
            }
            if (!user.totpSecret) throw new TotpSetupError();

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) {
                console.log("Throwing INVALID_TOTP");
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
           console.error("Authorize error:", error);
           return null;
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
