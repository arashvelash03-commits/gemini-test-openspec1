# Story 1.4: Admin-Led User Provisioning

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system administrator,
I want to create, view, and manage Doctor and Clerk user accounts via a dedicated Admin Panel,
so that initial user provisioning is controlled and secure.

## Acceptance Criteria

- Given a user with the role of system administrator,
- When they access the Admin Panel,
- Then they can create a new user with a unique phone number or national code, a strong password, and an assigned role of either "Doctor" or "Clerk".
- And a `created_by` field is populated with the administrator's user ID.
- And an error is shown if the phone number or national code is already in use.
- And they can view a list of all Doctors and Clerks.
- And they can edit or deactivate Doctor and Clerk accounts.

## Tasks / Subtasks

- [ ] **Backend:** Develop the API for user provisioning.
  - [ ] Create endpoints for creating, reading, updating, and deactivating user accounts.
  - [ ] Implement role-based access control to ensure only administrators can access these endpoints.
  - [ ] Add validation to check for unique phone numbers and national codes.
- [ ] **Frontend:** Build the Admin Panel UI.
  - [ ] Create a new page for the Admin Panel.
  - [ ] Design a form for creating new users.
  - [ ] Display a table or list of existing users with their details.
  - [ ] Add functionality to edit and deactivate users.
- [ ] **Integration:** Connect the Admin Panel to the backend API.
- [ ] **Database:** Update the database schema to include the `created_by` field in the user table.

## Dev Notes

- **Security:** This is a critical feature with high-security implications. Ensure that all endpoints are properly secured and that only authorized users can perform administrative actions.
- **UI/UX:** The Admin Panel should be intuitive and easy to use. Provide clear feedback to the administrator on the success or failure of their actions.
- **Error Handling:** Implement comprehensive error handling to gracefully manage scenarios like duplicate user entries or invalid data.

### Project Structure Notes

- The Admin Panel will be a new feature, so a new directory `src/features/admin` will be created.
- The API endpoints will be added to a new tRPC router in `src/server/routers/admin.ts`.
- The database schema in `src/lib/db.ts` will be modified to include the `created_by` field.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Admin-Led User Provisioning]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
