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
      const isPublic = isOnLogin;

      if (isLoggedIn) {
        const user = auth.user;
        const isStaff = user.role === 'doctor' || user.role === 'clerk';
        const isAdmin = user.role === 'admin';

        // Redirect logic for logged-in users trying to access login
        if (isOnLogin) {
          if (isAdmin) return Response.redirect(new URL('/admin/users', nextUrl));
          // Staff redirection based on 2FA status
          if (isStaff && !user.totpEnabled) return Response.redirect(new URL('/setup-2fa', nextUrl));
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

        // Redirect logic for root path
        if (nextUrl.pathname === '/') {
           if (isAdmin) return Response.redirect(new URL('/admin/users', nextUrl));
           return Response.redirect(new URL('/dashboard', nextUrl));
        }

        // Mandatory 2FA Check for Staff
        if (isStaff && !user.totpEnabled) {
             if (!isOnSetup2FA) {
                return Response.redirect(new URL('/setup-2fa', nextUrl));
             }
             // Allow access to setup-2fa
             return true;
        } else if (isOnSetup2FA) {
             // If already enabled, redirect away from setup
             if (user.totpEnabled) {
                if (isAdmin) return Response.redirect(new URL('/admin/users', nextUrl));
                return Response.redirect(new URL('/dashboard', nextUrl));
             }
        }

        // Admin Access Control
        if (nextUrl.pathname.startsWith('/admin') && !isAdmin) {
             return Response.redirect(new URL('/dashboard', nextUrl));
        }

        return true;
      }

      // Not logged in
      if (isPublic) {
          return true;
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.totpEnabled = user.totpEnabled;
      }

      // Handle session update (e.g. after enabling 2FA)
      if (trigger === "update" && session) {
          if (session.totpEnabled !== undefined) {
              token.totpEnabled = session.totpEnabled;
          }
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
