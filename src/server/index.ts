import { router } from "./trpc";
import { totpRouter } from "./routers/totp";
import { adminRouter } from "./routers/admin";
import { profileRouter } from "./routers/profile";
import { staffRouter } from "./routers/staff";

export const appRouter = router({
  totp: totpRouter,
  admin: adminRouter,
  profile: profileRouter,
  staff: staffRouter,
});

export type AppRouter = typeof appRouter;
