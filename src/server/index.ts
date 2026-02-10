import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { totpRouter } from "./routers/totp";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  auth: authRouter,
  totp: totpRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
