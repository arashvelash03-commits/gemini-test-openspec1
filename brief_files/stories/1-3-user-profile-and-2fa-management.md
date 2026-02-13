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

- [x] **Backend:** Create API endpoints for profile management.
  - [x] Endpoint to get user profile data.
  - [x] Endpoint to update user profile data (with validation).
  - [x] Endpoint to change password (with current password confirmation).
  - [x] Endpoint to initiate 2FA reset.
  - [x] Endpoint to confirm 2FA reset (implied by re-setup flow).
- [x] **Frontend:** Develop the user profile page.
  - [x] Display user information.
  - [x] Create forms for updating profile information and changing password.
  - [x] Add a section for 2FA management, including a "Reset 2FA" button.
  - [x] Implement the 2FA reset flow (redirects to setup).
- [x] **Integration:** Connect frontend components to the backend APIs.
- [x] **Security:** Ensure all profile update operations are secure and authorized.

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

Gemini 2.0 Flash

### Debug Log References

- Verified Zod v4 migration.
- Verified Sidebar and Header styling against mockups.
- Confirmed Profile page functionality (Update Profile, Change Password, Reset 2FA).

### Completion Notes List

- Implemented `ProfileView` component with tabs for Profile, Password, and 2FA.
- Used `zod` for strict schema validation.
- Integrated with tRPC backend for data persistence.
- Added strict Tailwind styling to match provided UI mockups.

### File List
- src/components/features/profile/profile-view.tsx
- src/components/features/profile/profile-schema.ts
- src/server/routers/profile.ts
- src/app/(clerk)/clerks/profile/page.tsx
- src/app/(doctor)/doctors/profile/page.tsx
- src/app/(admin)/admin/profile/page.tsx
