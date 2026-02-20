import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { type Context } from "@/server/context";

type LogAuditParams = {
  action: string;
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
  const ipAddress = ctx.ipAddress || null; // From context update
  const userAgent = ctx.userAgent || null; // From context update

  // Perform the insert
  try {
    await db.insert(auditLogs).values({
      actorUserId,
      action,
      resourceType,
      resourceId: resourceId || null,
      details: details || {},
      ipAddress,
      userAgent,
      occurredAt: new Date(), // Explicitly set if needed, but defaultNow() handles it too. Let's use new Date() to be explicit.
    });
  } catch (error) {
    // In a production system, we might want to log this error to a monitoring service
    // but we should not fail the main request if logging fails, unless strict compliance requires it.
    // For this implementation, we'll log to console error.
    console.error("Failed to write audit log:", error);
    // Depending on requirements, we might want to rethrow. Given "Secure Audit Logging",
    // maybe we should fail if we can't log?
    // The requirement says "an entry is automatically recorded".
    // If it fails, strictly speaking, the requirement isn't met.
    // However, usually we don't want to block user actions on log failure unless it's critical.
    // I'll rethrow for now to be safe and ensure visibility of failures.
    throw error;
  }
}
