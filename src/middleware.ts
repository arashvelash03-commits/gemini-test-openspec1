import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // console.log(`[Middleware] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}`);

  const isOnLogin = nextUrl.pathname.startsWith('/login');
  const isOnSetup2FA = nextUrl.pathname.startsWith('/setup-2fa');
  const isPublic = isOnLogin;

  if (isLoggedIn) {
      const user = req.auth?.user;
      const isStaff = user?.role === 'doctor' || user?.role === 'clerk';
      const isAdmin = user?.role === 'admin';
      const totpEnabled = user?.totpEnabled;

      if (isOnLogin) {
          if (isAdmin) return NextResponse.redirect(new URL('/admin/users', nextUrl));
          if (isStaff && !totpEnabled) return NextResponse.redirect(new URL('/setup-2fa', nextUrl));
          return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }

      if (nextUrl.pathname === '/') {
          if (isAdmin) return NextResponse.redirect(new URL('/admin/users', nextUrl));
          return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }

      if (isStaff && !totpEnabled) {
          if (!isOnSetup2FA) return NextResponse.redirect(new URL('/setup-2fa', nextUrl));
          return NextResponse.next();
      } else if (isOnSetup2FA) {
          if (totpEnabled) {
             if (isAdmin) return NextResponse.redirect(new URL('/admin/users', nextUrl));
             return NextResponse.redirect(new URL('/dashboard', nextUrl));
          }
      }

      if (nextUrl.pathname.startsWith('/admin') && !isAdmin) {
          return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }

      return NextResponse.next();
  }

  // Not logged in
  if (!isPublic && nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
