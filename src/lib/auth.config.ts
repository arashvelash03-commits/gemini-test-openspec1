import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnSetup2FA = nextUrl.pathname.startsWith('/setup-2fa');

      if (isLoggedIn) {
        const user = auth.user;
        const isStaff = user.role === 'doctor' || user.role === 'clerk';

        if (isOnLogin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

        // Mandatory 2FA Check
        if (isStaff && !user.totpEnabled) {
             if (!isOnSetup2FA) {
                return Response.redirect(new URL('/setup-2fa', nextUrl));
             }
        } else if (isOnSetup2FA) {
             if (user.totpEnabled) {
                return Response.redirect(new URL('/dashboard', nextUrl));
             }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.totpEnabled = user.totpEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.totpEnabled = token.totpEnabled as boolean;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
