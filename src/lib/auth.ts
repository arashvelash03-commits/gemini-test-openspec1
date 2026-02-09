import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { authenticator } from "otplib";

const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  totpCode: z.string().optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Phone or National Code", type: "text" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "TOTP Code", type: "text" },
      },
      authorize: async (credentials) => {
        const { identifier, password, totpCode } = await signInSchema.parseAsync(credentials);

        const user = await db.query.users.findFirst({
          where: or(
            eq(users.phoneNumber, identifier),
            eq(users.nationalCode, identifier)
          ),
        });

        if (!user || !user.passwordHash) {
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
             // Should not happen if enabled is true, but safe guard
             throw new Error("TOTP_SETUP_ERROR");
          }

          const isValidTotp = authenticator.check(totpCode, user.totpSecret);
          if (!isValidTotp) {
            throw new Error("INVALID_TOTP");
          }
        }

        return {
          id: user.id,
          name: user.fullName, // Mapping fullName to name
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
