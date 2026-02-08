import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return { session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
