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

// Mock users for testing when DB is unavailable
const MOCK_USERS = {
  "0000000000": {
    id: "mock-admin-id",
    name: "Mock Admin",
    role: "admin",
    totpEnabled: false,
    passwordHash: "$2a$10$abcdefg...",
  },
  "1111111111": {
    id: "mock-doctor-no2fa-id",
    name: "Mock Doctor No 2FA",
    role: "doctor",
    totpEnabled: false,
    passwordHash: "$2a$10$abcdefg...",
  },
  "2222222222": {
    id: "mock-doctor-2fa-id",
    name: "Mock Doctor With 2FA",
    role: "doctor",
    totpEnabled: true,
    totpSecret: "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD", // Known secret
    passwordHash: "$2a$10$abcdefg...",
  },
  "3333333333": {
    id: "mock-clerk-id",
    name: "Mock Clerk",
    role: "clerk",
    totpEnabled: false,
    passwordHash: "$2a$10$abcdefg...",
  },
};

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

          // Mock user logic (Keep until DB is stable)
          if (MOCK_USERS[identifier as keyof typeof MOCK_USERS]) {
             const mockUser = MOCK_USERS[identifier as keyof typeof MOCK_USERS];
             if (password === "password123") {
                if (mockUser.totpEnabled) {
                   // Check for undefined, null, empty string, or "undefined" string explicitly
                   if (!totpCode || totpCode === "undefined" || totpCode === "null" || totpCode.trim() === "") {
                       throw new TotpRequiredError();
                   }
                   const isValid = authenticator.check(totpCode, mockUser.totpSecret!);
                   if (!isValid) {
                       throw new InvalidTotpError();
                   }
                }
                return {
                   id: mockUser.id,
                   name: mockUser.name,
                   role: mockUser.role,
                   totpEnabled: mockUser.totpEnabled,
                };
             }
             return null;
          }

          // ... (DB logic similar update) ...
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
            if (!totpCode || totpCode === "undefined" || totpCode === "null" || totpCode.trim() === "") {
              throw new TotpRequiredError();
            }
            if (!user.totpSecret) throw new TotpSetupError();

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) throw new InvalidTotpError();
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
