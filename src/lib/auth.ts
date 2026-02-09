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
        console.log("Authorize called with identifier:", credentials?.identifier);

        try {
          const { identifier, password, totpCode } = await signInSchema.parseAsync(credentials);

          const user = await db.query.users.findFirst({
            where: or(
              eq(users.phoneNumber, identifier),
              eq(users.nationalCode, identifier)
            ),
          });

          if (!user) {
            console.log("User not found for identifier:", identifier);
            return null;
          }

          if (!user.passwordHash) {
             console.log("User has no password hash");
             return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.passwordHash);

          if (!passwordMatch) {
            console.log("Password mismatch");
            return null;
          }

          if (user.totpEnabled) {
            console.log("TOTP enabled for user");
            if (!totpCode) {
              console.log("TOTP code missing, throwing TOTP_REQUIRED");
              throw new Error("TOTP_REQUIRED");
            }

            if (!user.totpSecret) {
               console.log("TOTP enabled but secret missing");
               throw new Error("TOTP_SETUP_ERROR");
            }

            const isValidTotp = authenticator.check(totpCode, user.totpSecret);
            if (!isValidTotp) {
              console.log("Invalid TOTP code");
              throw new Error("INVALID_TOTP");
            }
          }

          console.log("User authenticated successfully:", user.id);
          return {
            id: user.id,
            name: user.fullName, // Mapping fullName to name
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error; // Re-throw to let NextAuth handle it (or masking it)
        }
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
