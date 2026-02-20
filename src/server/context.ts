import { auth } from "@/lib/auth";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (opts?: FetchCreateContextFnOptions) => {
  const session = await auth();

  // Extract headers if available (from Fetch API Request)
  const headers = opts?.req.headers;

  const userAgent = headers?.get("user-agent") || null;

  // Get IP address (prioritize X-Forwarded-For)
  let ipAddress = headers?.get("x-forwarded-for")?.split(',')[0] || null;

  return {
    session,
    headers,
    userAgent,
    ipAddress,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
