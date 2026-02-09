# Story 1.2: Enforce Mandatory 2FA for Staff

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system administrator,
I want to enforce mandatory Two-Factor Authentication (2FA) for all staff roles (doctors and clerks),
so that sensitive patient data is protected with an additional layer of security.

## Acceptance Criteria

- Given a staff user (doctor or clerk) attempts to log in,
- When their initial login credentials are valid,
- Then they are prompted to set up 2FA if not already configured.
- And they are required to provide a valid 2FA code to complete the login process.
- And patients are not required to use 2FA.

## Tasks / Subtasks

- [ ] **Backend:** Implement 2FA logic in the authentication flow.
  - [ ] Generate a secret key for the user and store it securely.
  - [ ] Generate a QR code for the user to scan with their authenticator app.
  - [ ] Verify the TOTP code provided by the user.
  - [ ] Add a field to the user model to track 2FA status (enabled/disabled).
- [ ] **Frontend:** Create the UI for 2FA setup and verification.
  - [ ] Display the QR code and secret key during setup.
  - [ ] Provide an input field for the user to enter the 2FA code.
  - [ ] Handle API errors and display appropriate messages.
- [ ] **Integration:** Connect the frontend and backend.
  - [ ] Create a tRPC endpoint to enable/disable 2FA.
  - [ ] Create a tRPC endpoint to verify the 2FA code during login.
- [ ] **Documentation:** Update documentation to reflect the new 2FA requirement for staff.

## Dev Notes

- **Authentication Library:** NextAuth.js will be used. Investigate its support for TOTP-based 2FA.
- **QR Code Generation:** Use a library like `qrcode` to generate the QR code on the server.
- **Security:** Ensure the 2FA secret is stored encrypted in the database.
- **User Experience:** The 2FA setup process should be as smooth as possible. Provide clear instructions and recovery options.

### Project Structure Notes

- Authentication logic is located in `src/lib/auth.ts` and `src/server/auth`.
- User-related database schema is in `src/lib/db.ts`.
- Frontend components will be created in the `src/features/auth` directory.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Enforce Mandatory 2FA for Staff]
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
