# Story 1.5: Doctor-Led Staff Provisioning (Extensible)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Doctor,
I want to create and manage accounts for my clinic staff (currently Clerks, with future support for Nurses/Assistants/Doctors),
So that I can build my team and delegate access appropriate to their roles.

## Acceptance Criteria

*   **Given** a user with the role of "Doctor",
*   **When** they access their user management interface,
*   **Then** they can create a new user and select their role from a list (currently restricted to "Clerk", but architected to support Nurse/Assistant/Doctor in future updates).
*   **And** a `created_by` field is populated with the Doctor's user ID to establish hierarchy.
*   **And** they can view a list of all staff members they have created.
*   **And** they can edit or deactivate the accounts of staff members they have created.

## Tasks / Subtasks

- [ ] Task 1 (AC: #)
  - [ ] Subtask 1.1
- [ ] Task 2 (AC: #)
  - [ ] Subtask 2.1

## Dev Notes

### Relevant Architecture Patterns and Constraints

*   **Authentication & Security:** Username/Password + Two-Factor Authentication (2FA) using NextAuth.js and PostgreSQL. 2FA is mandatory for staff. Role-Based Access Control (RBAC) will be used, with a `role` column (`doctor`, `clerk`, `patient`) in the `users` table. The `users` table implements a **Single-Table Inheritance pattern** for different user roles.
*   **Data Architecture:** PostgreSQL as the main database. PowerSync for offline sync with SQLite on client devices. `UUID (v4)` generated on the client for primary keys. Soft deletes using `deleted_at` timestamps. The `created_by` field in the `users` table is crucial for establishing the **Registration Hierarchy** (Admin -> Doctor -> Clerk -> Patient).
*   **Naming Patterns:** `snake_case` for PostgreSQL, `camelCase` for TypeScript, with boundary transformation.
*   **Structure Patterns:** Feature-Based project organization (e.g., `src/features/admin/`).
*   **API & Communication Patterns:** PowerSync for primary data sync. tRPC for server-side operations.
*   **FHIR Compliance Boundary:** All features must map their data structures to standard FHIR Resources. The `fhir_data` JSONB column will store role-specific attributes (e.g., `medical_license` for Doctors) and other complex medical data.
*   **Guiding Principles for Offline-First Schema:** Client-Generated IDs, Immutable Records & Soft Deletes, Timestamps for Conflict Resolution, Data Partitioning for Sync Rules.

### Source Tree Components to Touch

*   `src/app/(doctor)/users/page.tsx`: This would be the likely location for the Doctor's user management interface.
*   `src/server/routers/admin.ts` or `src/server/routers/users.ts`: tRPC router for handling user provisioning logic.
*   `src/lib/db/schema.ts`: Drizzle schema for the `users` table to ensure `created_by` and `role` are correctly defined.
*   `src/lib/powersync/AppSchema.ts`: Client-side SQLite schema for `users` table.
*   `src/features/admin/components/UserForm.tsx`: A reusable form component for user creation/editing.
*   `src/features/admin/components/UserListTable.tsx`: A component to display the list of staff members.

### Testing Standards Summary

*   Unit tests for tRPC procedures and database interactions.
*   Integration tests for the user provisioning flow.
*   UI tests to ensure the user management interface functions correctly and adheres to UX specifications.

## Project Structure Notes

*   The `(doctor)` route group in `src/app` will contain the Doctor's specific workflows, including the user management interface.
*   Feature-based organization will be used, so components and logic related to user management will likely reside in `src/features/users/` or `src/features/admin/`.
*   The `lib/db` directory will contain server-side database logic, while `lib/powersync` will handle client-side SQLite and PowerSync integration.

## References

*   [Epics and Stories](C:\Users\FATER\Desktop\reyzone\gemini-test-openspec1\_bmad-output\planning-artifacts\epics.md)
*   [Architecture Decision Document](C:\Users\FATER\Desktop\reyzone\gemini-test-openspec1\_bmad-output\planning-artifacts\architecture.md)
*   [UX Design Specification](C:\Users\FATER\Desktop\reyzone\gemini-test-openspec1\_bmad-output\planning-artifacts\ux-design-specification.md)

## Dev Agent Record

### Agent Model Used

Gemini

### Debug Log References

(None yet)

### Completion Notes List

- Initial story file created based on `template.md` and information from `epics.md`, `architecture.md`, and `ux-design-specification.md`.
- Story status set to `ready-for-dev`.

### File List
- `C:\Users\FATER\Desktop\reyzone\gemini-test-openspec1\_bmad-output\implementation-artifacts\1-5-doctor-led-user-provisioning.md`
