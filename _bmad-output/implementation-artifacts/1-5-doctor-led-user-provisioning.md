# Story 1.5: Doctor-Led Staff Provisioning

Status: ready-for-dev

## Story

As a Doctor,
I want to create and manage accounts for my clinic staff (currently Clerks, with future support for Nurses/Assistants/Doctors),
So that I can build my team and delegate access appropriate to their roles.

## Acceptance Criteria

- **Given** a user with the role of "Doctor",
- **When** they access their staff management interface,
- **Then** the interface loads within the main content area (Left Container) without reloading the Header or Right Sidebar.
- **And** they can view a list of all staff members they have created (filtered by `created_by`).
- **And** they can create a new user account via a Modal (preserving the page context).
- **And** the role is strictly limited to "Clerk" for this version (MVP), but the system is architected to support other staff roles later.
- **And** the creation form requires:
    - National Code (Unique)
    - Phone Number (Unique)
    - Full Name
    - Password (Initial setup)
- **And** a `created_by` field is automatically populated with the Doctor's user ID.
- **And** they can edit the details of their staff.
- **And** they can deactivate staff accounts.
- **And** they cannot modify accounts they did not create.

## Tasks / Subtasks

- [ ] **Backend:** Implement `staffRouter` (tRPC) - *Ref: `src/server/routers/admin.ts`*
  - [ ] Create `createStaff` procedure:
    - [ ] Reuse/Adapt validation logic from `admin.createUser`.
    - [ ] **CRITICAL:** Enforce `created_by: ctx.user.id`.
    - [ ] **Role Logic:** Validate the input `role` against an "Allowed Staff Roles" list.
        - *Current Allowed List:* `['clerk']`.
        - *Future:* `['clerk', 'nurse', 'assistant']`.
        - *Error:* If role is not in the allowed list, throw generic Forbidden error.
    - [ ] Handle unique constraint violations (National Code/Phone).
  - [ ] Create `getMyStaff` procedure:
    - [ ] Logic: `SELECT * FROM users WHERE created_by = ctx.user.id`.
  - [ ] Create `updateStaff` procedure:
    - [ ] **CRITICAL:** Ensure `created_by` matches `ctx.user.id` before allowing update.
  - [ ] Create `toggleStaffStatus` procedure.
- [ ] **Frontend:** Create Staff Management UI - *Ref: `src/app/admin/users/page.tsx`*
  - [ ] **Layout Compliance:** Ensure `src/app/(doctor)/doctors/staff/page.tsx` **ONLY** renders the main content (Table/Page Header). DO NOT re-import the Sidebar or Global Header; these are handled by `src/app/(doctor)/layout.tsx`.
  - [ ] **Reuse/Adapt Strategy:** Extract the table/form logic from `src/app/admin/users/user-management-view.tsx` into a reusable component (e.g., `UserManagementTable`) if possible, OR copy-paste and adapt to `src/features/staff/components/StaffManagementView.tsx`.
  - [ ] **RTL Alignment:** Ensure the table and forms render correctly in the Left Container, respecting the RTL direction of the existing Right Sidebar.
  - [ ] **Modal-First:** Use the existing Dialog/Modal patterns for the "Create Staff" flow to ensure the background context (the list) remains visible.
- [ ] **Integration:**
  - [ ] Connect UI to `staff` tRPC router.
  - [ ] Verify RBAC (Doctor can only see/edit their own clerks).
  - [ ] Verify seamless navigation (no full reload) when entering/exiting this page.

## Dev Notes

### 🏗️ Layout & Navigation (CRITICAL)
- **Persistent Layout:** The application uses `src/app/(doctor)/layout.tsx` to provide the **Right Sidebar** and **Header**.
- **Page Responsibility:** Your work in `src/app/(doctor)/doctors/staff/page.tsx` is strictly for the **Left Container** (Main Content).
- **Zero Layout Shift:** Do not add margins or padding that conflict with the layout container. The `layout.tsx` handles the grid/flex structure.
- **SPA Behavior:** Ensure all internal links use `next/link` to prevent full page reloads.

### 💡 Logic & UI Reuse/Adapt (From Story 1.4)
Story 1.4 (Admin Provisioning) is **DONE** and contains 90% of the logic needed here.
- **Backend:** `src/server/routers/admin.ts` has the Zod schemas and error handling. Copy this pattern but **tighten the scope** (add `created_by` filter).
- **Frontend:** `src/app/admin/users/user-management-view.tsx` is your blueprint.
    - Remove the "Role" dropdown (hardcode to Clerk for MVP) OR keep it as a `Select` component with a single option `'Clerk'` to easily add `'Nurse'` later.
    - Ensure the "Created By" column is either hidden or implies "Me".
    - **Refactoring:** If safe, create a shared `UserCrud` component. If not, duplication is acceptable to speed up delivery.

### 🔮 Future Support for Other Roles
- **Backend Extensibility:** Do not simply hardcode `role = 'clerk'` inside the INSERT statement. Instead, accept a `role` argument in the API and validate it against an array of allowed roles (e.g., `const ALLOWED_STAFF_ROLES = ['clerk']`).
- **Data Model:** The `users` table handles all roles via the `role` Enum. No schema changes are required for future roles, only Enum updates.

### File Structure Requirements
- **Page:** `src/app/(doctor)/doctors/staff/page.tsx`
- **Feature Logic:** `src/features/staff/`
    - `components/StaffManagementView.tsx` (Adapted from Admin view)
- **Server:** `src/server/routers/staff.ts`

### UI Reference
- **Mockup:** `_bmad-output\planning-artifacts/ui-refs/1-5-doctor-led-user-provisioning-ui`
- **Goal:** The UI should look identical to the Admin panel but scoped to the Doctor's context.

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List