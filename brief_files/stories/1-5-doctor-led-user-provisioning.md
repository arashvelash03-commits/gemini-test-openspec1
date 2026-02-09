# Story 1.5: Doctor-Led User Provisioning

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Doctor,
I want to create, view, and manage Clerk and Patient user accounts,
so that I can delegate tasks and manage my patient roster.

## Acceptance Criteria

- Given a user with the role of "Doctor",
- When they access their user management interface,
- Then they can create a new user with the role of "Clerk" or "Patient".
- And a `created_by` field is populated with the Doctor's user ID.
- And they can view a list of all Clerks and Patients they have created.
- And they can edit or deactivate the accounts of Clerks and Patients they have created.

## Tasks / Subtasks

- [ ] **Backend:** Extend the user provisioning API.
  - [ ] Modify the user creation endpoint to allow doctors to create clerks and patients.
  - [ ] Implement authorization to ensure doctors can only manage users they have created.
  - [ ] Ensure the `created_by` field is correctly populated.
- [ ] **Frontend:** Create the user management interface for doctors.
  - [ ] Design a new page or section within the doctor's dashboard for user management.
  - [ ] Build a form for creating new clerk and patient users.
  - [ ] Display a list of created users with options to edit or deactivate them.
- [ ] **Integration:** Connect the doctor's user management interface to the backend API.
- [ ] **Testing:** Add tests to verify that doctors can only manage their own created users and not other users in the system.

## Dev Notes

- **Role-Based Access Control (RBAC):** This feature requires careful implementation of RBAC to maintain security and data privacy. A doctor should never be able to see or manage patients or clerks created by another doctor unless explicitly granted permission.
- **User Interface:** The user management interface for doctors should be distinct from the system administrator's Admin Panel and tailored to the specific needs of a doctor.
- **Data Integrity:** Ensure that when a doctor's account is deactivated, there is a clear process for handling the users they have created.

### Project Structure Notes

- The UI components for this feature will be located in `src/features/doctor/user-management`.
- The API logic will be added to the existing tRPC routers, with appropriate authorization checks.
- The database schema is already updated with the `created_by` field.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5: Doctor-Led User Provisioning]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
