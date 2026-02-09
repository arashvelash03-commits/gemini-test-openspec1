import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: string;
      id: string;
      totpEnabled: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    id: string;
    // fullName is used in our DB, but NextAuth expects name. We map it.
    fullName?: string | null;
    totpEnabled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    totpEnabled: boolean;
  }
}
