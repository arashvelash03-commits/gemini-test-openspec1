# Story 1.6: Clerk-Led Patient Provisioning

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Clerk,
I want to create, view, and manage Patient user accounts,
so that I can register new patients for the clinic.

## Acceptance Criteria

- Given a user with the role of "Clerk",
- When they access their user management interface,
- Then they can create a new user with the role of "Patient".
- And a `created_by` field is populated with the Clerk's user ID.
- And they can view a list of all Patients they have created.
- And they can edit or deactivate the accounts of Patients they have created.

## Tasks / Subtasks

- [ ] **Backend:** Enhance the user provisioning API for clerks.
  - [ ] Adjust the user creation endpoint to permit clerks to create patient accounts.
  - [ ] Implement authorization to ensure clerks can only manage patient accounts they have created.
  - [ ] Verify the `created_by` field is correctly populated with the clerk's ID.
- [ ] **Frontend:** Develop the patient management interface for clerks.
  - [ ] Create a dedicated section in the clerk's dashboard for patient management.
  - [ ] Build a form for registering new patients.
  - [ ] Display a list of patients created by the clerk, with options to edit or deactivate their accounts.
- [ ] **Integration:** Link the clerk's patient management interface with the backend API.
- [ ] **Testing:** Write tests to confirm that clerks can only manage the patient accounts they are responsible for.

## Dev Notes

- **RBAC:** This feature is another important step in building out the application's RBAC. It's crucial that a clerk cannot access or manage patients created by another clerk or doctor.
- **Workflow Integration:** The patient creation process should be seamless and integrated into the clerk's daily workflow. Consider adding a shortcut or quick-add button for patient registration.
- **Data Privacy:** All patient data must be handled with the utmost care, and access must be strictly controlled and logged.

### Project Structure Notes

- The UI components for this feature will be located in `src/features/clerk/patient-management`.
- The API logic will be incorporated into the existing tRPC routers, with the necessary authorization checks.
- The database schema is already updated with the `created_by` field.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.6: Clerk-Led Patient Provisioning]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
