# Story 1.3: User Profile and 2FA Management

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered user,
I want to view and update my personal profile information (e.g., password, contact details) and manage my 2FA settings,
so that my account information is accurate and secure.

## Acceptance Criteria

- Given a logged-in user,
- When they navigate to their profile settings,
- Then they can view their current profile information.
- And they can update editable fields (e.g., password, phone number, national code).
- And changes are saved securely and reflected in their profile.
- And password changes require re-authentication or current password confirmation.
- And they can request a reset of their 2FA key through a secure process.
- And upon successful 2FA reset, their old key is invalidated and they are provided with a new key.

## Tasks / Subtasks

- [ ] **Backend:** Create API endpoints for profile management.
  - [ ] Endpoint to get user profile data.
  - [ ] Endpoint to update user profile data (with validation).
  - [ ] Endpoint to change password (with current password confirmation).
  - [ ] Endpoint to initiate 2FA reset.
  - [ ] Endpoint to confirm 2FA reset.
- [ ] **Frontend:** Develop the user profile page.
  - [ ] Display user information.
  - [ ] Create forms for updating profile information and changing password.
  - [ ] Add a section for 2FA management, including a "Reset 2FA" button.
  - [ ] Implement the 2FA reset flow (e.g., email confirmation).
- [ ] **Integration:** Connect frontend components to the backend APIs.
- [ ] **Security:** Ensure all profile update operations are secure and authorized.

## Dev Notes

- **UI/UX:** The profile page should be user-friendly and provide clear feedback on actions (e.g., successful update, error messages).
- **2FA Reset:** The 2FA reset process must be secure to prevent unauthorized account takeover. Consider sending a confirmation link to the user's registered email address.
- **Data Validation:** Implement robust validation on both the client and server sides to ensure data integrity.

### Project Structure Notes

- Profile management components will be located in `src/features/profile`.
- API endpoints will be added to the tRPC router in `src/server/routers`.
- The user model in `src/lib/db.ts` may need to be updated to support 2FA reset tokens.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3 (Revised): User Profile and 2FA Management]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
