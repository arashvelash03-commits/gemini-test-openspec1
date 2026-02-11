import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { totpRouter } from "./routers/totp";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";

export const appRouter = router({
  auth: authRouter,
  totp: totpRouter,
  admin: adminRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
