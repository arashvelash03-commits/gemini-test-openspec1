import { router, protectedProcedure } from "../trpc";
import { logAudit } from "../services/audit";

export const authRouter = router({
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await logAudit(ctx, {
      action: "user_logout",
      resourceType: "user",
      resourceId: ctx.session.user.id,
      details: {},
    });
    return { success: true };
  }),
});
