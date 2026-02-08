import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      identifier: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { identifier, password } = input;
      const user = await db.query.users.findFirst({
        where: or(
          eq(users.phoneNumber, identifier),
          eq(users.nationalCode, identifier)
        ),
      });

      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }

      return { success: true };
    }),
});
