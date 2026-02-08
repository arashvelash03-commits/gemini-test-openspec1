## Why

This change is needed to enable registered users to securely log in to the system using their phone number or national code and a password. This addresses the fundamental requirement for user access and system security.

## What Changes

- Implement a user login feature that authenticates users via phone number/national code and password.
- Integrate NextAuth.js for robust session management and authentication flow.
- Develop a new tRPC procedure to handle user authentication requests.
- Create a dedicated login page within the frontend application.
- Update the database schema to support user credentials and NextAuth.js session/account management.

## Capabilities

### New Capabilities
- `user-authentication`: Enables registered users to authenticate using their phone number or national code and password, and establishes a secure session upon successful login.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **Codebase:**
    - `src/app/api/trpc/[trpc]/route.ts`: Addition of a new tRPC authentication procedure.
    - `src/server/routers/auth.ts`: Creation of a new router for authentication logic.
    - `src/app/(auth)/login/page.tsx`: New frontend page for user login.
    - `src/lib/auth.ts`: Configuration for NextAuth.js options.
    - `src/app/api/auth/[...nextauth]/route.ts`: NextAuth.js API route handler.
    - `src/lib/db.ts`: Potential modifications for database interactions related to authentication.
- **Database:**
    - `users` table: Will store `phone_number`, `national_code`, and `password_hash`.
    - `sessions` table: Required for NextAuth.js session management.
    - `accounts` table: Required for NextAuth.js account management.
- **APIs:** Introduction of a new tRPC endpoint for user login.
- **Dependencies:** NextAuth.js integration.
