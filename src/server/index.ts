import { router } from "./trpc";
import { totpRouter } from "./routers/totp";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";
import { staffRouter } from "./routers/staff";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  totp: totpRouter,
  admin: adminRouter,
  profile: profileRouter,
  staff: staffRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
