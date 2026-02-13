import { router } from "./trpc";
import { totpRouter } from "./routers/totp";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";

export const appRouter = router({
  totp: totpRouter,
  admin: adminRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;
