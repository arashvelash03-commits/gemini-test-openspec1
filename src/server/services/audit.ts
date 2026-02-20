import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { type Context } from "@/server/context";

// Define strict audit actions for type safety
export type AuditAction =
  | "user_login"
  | "user_logout"
  | "create_user"
  | "update_user"
  | "toggle_user_status"
  | "update_profile"
  | "change_password"
  | "reset_2fa"
  | "view_audit_logs" // If we want to log log viewing
  | "create_staff"    // Assuming staff management
  | "update_staff"
  | "delete_staff";

type LogAuditParams = {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
};

/**
 * Logs an action to the audit_logs table.
 * This function enforces immutability by only supporting INSERT operations.
 *
 * @param ctx - The tRPC context containing session and request info
 * @param params - The details of the action being logged
 */
export async function logAudit(
  ctx: Context,
  params: LogAuditParams
) {
  const { action, resourceType, resourceId, details } = params;

  // Extract actor info from context
  const actorUserId = ctx.session?.user?.id || null;
  const ipAddress = ctx.ipAddress || null;
  const userAgent = ctx.userAgent || null;

  // Capture actor details for denormalization (to preserve info even if user is deleted)
  const actorDetails = ctx.session?.user ? {
    name: ctx.session.user.name,
    role: ctx.session.user.role,
  } : null;

  // Perform the insert
  try {
    await db.insert(auditLogs).values({
      actorUserId,
      action,
      resourceType,
      resourceId: resourceId || null,
      details: details || {},
      actorDetails,
      ipAddress,
      userAgent,
      // occurredAt: defaultNow() handles this
    });
  } catch (error) {
    // In a production system, we might want to log this error to a monitoring service.
    console.error("Failed to write audit log:", error);
    // For this implementation, we rethrow to ensure visibility of failures.
    throw error;
  }
}
