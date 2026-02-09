import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { totpRouter } from "./routers/totp";

export const appRouter = router({
  auth: authRouter,
  totp: totpRouter,
});

export type AppRouter = typeof appRouter;
