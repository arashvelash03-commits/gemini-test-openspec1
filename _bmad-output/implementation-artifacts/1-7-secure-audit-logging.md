# Story 1.7: secure-audit-logging

Status: ready-for-review

## Story

As a system administrator,
I want the system to maintain a secure, immutable audit log of all access to electronic Protected Health Information (ePHI),
so that I can track and verify compliance with security regulations.

## Acceptance Criteria

1. **Given** any user accesses or modifies ePHI within the system,
2. **When** the action occurs,
3. **Then** an entry is automatically recorded in an immutable audit log.
4. **And** the log entry includes the user's identity, the action performed, the timestamp, and the specific ePHI accessed or modified.
5. **And** the audit log is protected from unauthorized modification or deletion.
6. **And** the audit log viewing interface utilizes the default header and sidebar

## Tasks / Subtasks

- [x] **Database & Schema Configuration**
  - [x] Add the `audit_logs` table to `src/lib/db/schema.ts` strictly matching the schema defined in the architecture.
  - [x] Ensure the schema uses `id` (UUID PK), `actor_user_id` (UUID FK), `action` (TEXT), `resource_type` (TEXT), `resource_id` (UUID), `details` (JSONB), `ip_address` (TEXT), `user_agent` (TEXT), and `occurred_at` (TIMESTAMPTZ DEFAULT NOW()).
  - [x] Generate and apply the Drizzle database migration.
    - *Note:* Migration file `drizzle/0003_mature_doctor_spectrum.sql` generated. Manual execution required in environment with running DB.
- [x] **Context & Metadata Capture**
  - [x] Update the tRPC context in `src/server/context.ts` to extract and expose the `ip_address` (e.g., via `x-forwarded-for` headers) and `user_agent` from the incoming Next.js request.
- [x] **Audit Logging Service/Middleware**
  - [x] Create a reusable audit logging utility or tRPC middleware (e.g., `src/server/services/audit.ts` or within `src/server/trpc.ts`) that accepts the action, resource type, resource ID, and details.
  - [x] Ensure this utility automatically pulls the `actor_user_id`, `ip_address`, and `user_agent` from the tRPC context to construct the log entry.
  - [x] **Immutability Enforcement:** Ensure this service ONLY uses Drizzle `insert` commands. Do not write or expose any functions or tRPC procedures that allow `update` or `delete` operations on the `audit_logs` table.
- [x] **Integration (Proof of Concept)**
  - [x] Integrate the new audit logging utility into at least one existing sensitive endpoint (e.g., retrieving user profile data or updating staff in `staffRouter` or `adminRouter`) to prove ePHI access/modification tracking works.
- [x] **Frontend Viewer UI**
  - [x] Create the Audit Log viewing page for administrators.
  - [x] Wrap the page layout with the application's default header and sidebar components.

### Review Follow-ups (AI)
- [x] **1. Fix Architectural Violation: Feature-Based Slicing (Critical, Architecture):**
  - [x] Move the `AuditLogsView` component out of the routing tree from `src/app/(admin)/admin/audit-logs/audit-logs-view.tsx` into its correct feature boundary: `src/features/audit-logs/components/AuditLogsView.tsx`.
  - [x] Refactor `src/app/(admin)/admin/audit-logs/page.tsx` so it strictly acts as a route definition, importing and rendering the `AuditLogsView` component from the `src/features/` directory.
  - [x] Ensure no smart business logic or reusable UI components are left inside the `src/app/` directory tree, strictly adhering to the project structure boundaries.

- [x] **2. Implement Pagination for Audit Logs (Major, Performance):**
  - [x] Modify the `getAuditLogs` tRPC procedure in `src/server/routers/admin.ts` to accept pagination input (e.g., `cursor` or `page`/`limit`).
  - [x] Update the `AuditLogsView` component in `src/features/audit-logs/components/audit-logs-view.tsx` to include UI elements for pagination (e.g., "Load More" button or page numbers) and fetch data accordingly.

- [x] **3. Add Database Index for `actor_user_id` (Major, Performance):**
  - [x] Create a new Drizzle migration file.
  - [x] Add the SQL command to create an index on the `actor_user_id` column in the `audit_logs` table to improve query performance.

- [x] **4. Preserve Actor Information on User Deletion (Medium, Data Integrity):**
  - [x] Modify the `audit_logs` table schema in `src/lib/db/schema.ts` to include a new `actor_details` JSONB column (Note: separate from existing `details` column).
  - [x] Update the `logAudit` service in `src/server/services/audit.ts` to capture the actor's name and role from the context and store it in the new `actor_details` column, ensuring the log remains complete even if the user is deleted.
  - [x] Update the `getAuditLogs` query to use this denormalized data instead of joining with the `users` table.

- [x] **5. Use Specific Type for `log` Prop (Minor, Code Quality):**
  - [x] In `src/features/audit-logs/components/audit-logs-view.tsx`, define a TypeScript type for the log entry using tRPC's `inferRouterOutputs`.
  - [x] Apply this inferred type to the `log` prop in the `LogRows` component instead of `any`.

- [x] **6. Remove Redundant Timestamp Generation (Minor, Consistency):**
  - [x] In the `logAudit` service (`src/server/services/audit.ts`), remove the `occurredAt: new Date()` field from the `db.insert` call to rely on the database's `DEFAULT now()` mechanism as the single source of truth.

## Dev Notes

### 🏗️ Architecture & Security Constraints (CRITICAL)
- **Database Mapping:** You must implement the table exactly as specified in Epic 1's architecture schema. The `occurred_at` timestamp must be generated by the database (`DEFAULT NOW()`) to ensure immutability at the source.
- **Request Context:** You will need to carefully modify `src/server/context.ts` to parse request headers. Next.js App Router exposes headers in route handlers, which can be passed into the `createContext` function.
- **Append-Only:** The definition of "immutable" at the application layer means your code should physically lack the ability to update or delete rows in the `audit_logs` table. No tRPC mutations should exist for altering these logs.
- **UI Architecture:** The frontend must strictly adhere to the requested layout. Use the shared layout components for the header and sidebar, and explicitly utilize the `google stitch mcp server` for populating the main container of the audit logs view.

### 💡 Intelligence from Previous Stories
- RBAC is already firmly established using custom tRPC middlewares (e.g., `adminProcedure`, `doctorProcedure`) in `src/server/trpc.ts`. Leverage the existing `ctx.user` object to populate the `actor_user_id`.
- Drizzle ORM is used for all database interactions. Use the existing patterns found in `src/server/routers/admin.ts` or `src/server/routers/staff.ts` for database inserts.

### Project Structure Notes
- **Schema:** `src/lib/db/schema.ts`
- **Context:** `src/server/context.ts`
- **Core Logic:** `src/server/services/audit.ts` (Recommended new file for the reusable logging logic to keep routers clean).
- **Frontend Page:** `src/app/admin/audit-logs/page.tsx` 

### References
- Database Schema Guidelines: [Source: architecture.md#Appendix A: Detailed Database Schema]
- Requirement Epics: [Source: epics.md#Story 1.7: Secure Audit Logging]

## Dev Agent Record

### Agent Model Used
- Google Labs Jules (Simulated)

### Debug Log References
- `scripts/test-audit-logs.ts` verified structure and types.
- `npm run build` verified compilation and integration.
- Database migration file generated: `drizzle/0003_mature_doctor_spectrum.sql`.
- **Note:** Database migration could not be applied due to environment restrictions (no running DB/docker). Verification relied on build and static analysis. User must apply migration manually.

### Completion Notes List
- Implemented `audit_logs` table and migration.
- Updated `createContext` to capture IP and User Agent.
- Created `src/server/services/audit.ts` for immutable logging.
- Integrated audit logging into `adminRouter` and `staffRouter`.
- Implemented Audit Logs UI in `src/app/(admin)/admin/audit-logs` using `AdminSidebar` and consistent Tailwind design.
- Added "Reports" link to Admin Sidebar.
- Provided `scripts/manual-migrate.ts` for manual migration execution.
- **Review Follow-ups Completed:**
    - Refactored `AuditLogsView` to `src/features/audit-logs/components/`.
    - Added pagination and total count to audit logs query and UI.
    - Added `actor_details` column (denormalized user info) and index on `actor_user_id` to schema.
    - Generated migration `drizzle/0004_add_audit_actor_details_and_index.sql`.
    - Removed redundant `occurredAt` generation.
    - Added type safety to `AuditLogsView` using `inferRouterOutputs`.

### File List
- src/lib/db/schema.ts
- drizzle.config.ts
- drizzle/0003_mature_doctor_spectrum.sql
- drizzle/0004_add_audit_actor_details_and_index.sql
- src/server/context.ts
- src/server/services/audit.ts
- src/server/routers/admin.ts
- src/server/routers/staff.ts
- src/app/(admin)/admin/audit-logs/page.tsx
- src/features/audit-logs/components/audit-logs-view.tsx
- src/components/layout/admin-sidebar.tsx
- scripts/manual-migrate.ts
- scripts/check-db-schema.ts
