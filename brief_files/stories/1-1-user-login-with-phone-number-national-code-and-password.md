# Story 1.1: user-login-with-phone-number-national-code-and-password

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a registered user,
I want to log in with my phone number or national code and password,
so that I can access the system.

## Acceptance Criteria

- **Given** a registered user with a valid phone number or national code and password,
- **When** they enter their credentials on the login page,
- **Then** they are successfully authenticated and redirected to their role-specific dashboard.
- **And** an error message is shown for invalid credentials.
- **And** if TOTP is enabled for the user, they are prompted to enter their 2FA code.

## Tasks / Subtasks

- [x] **Backend:** Configure NextAuth.js and tRPC.
  - [x] Implement input validation for phone number/national code and password.
  - [x] Hash the provided password and compare it with the stored hash in the `users` table.
  - [x] On successful authentication, generate a session token using NextAuth.js.
  - [x] Implement TOTP verification logic.
- [x] **Frontend:** Create the login page.
  - [x] Create a form with fields for phone number/national code and password.
  - [x] Implement a submit handler that calls NextAuth `signIn`.
  - [x] On successful login, redirect the user to their role-specific dashboard.
  - [x] Display error messages returned from the server.
  - [x] Handle "TOTP_REQUIRED" state by showing the 2FA input field.
- [x] **Database:**
    - [x] The `users` table should be used for storing user information, including `phone_number`, `national_code`, and `password_hash`.
    - [x] The `sessions` and `accounts` tables are also required for NextAuth.js integration.
    - [x] Added `totp_secret` and `totp_enabled` columns to `users` table.

## Dev Notes

- **Relevant architecture patterns and constraints:**
    - **Tech Stack:** Next.js, NextAuth.js v5 (beta), tRPC, PostgreSQL, Drizzle ORM.
    - **Authentication:** Used NextAuth.js with the Credentials provider. Implemented TOTP logic manually using `otplib` as NextAuth Credentials provider doesn't support multi-step natively in a simple way.
    - **API:** Created `authRouter` and `totpRouter` (ready for future use). Login itself is handled via NextAuth's API route.
    - **Database:** Used Drizzle ORM with PostgreSQL. Schema strictly follows `architecture.md` (removed `name`, `email` columns from `users`).
    - **Security:**
        - Passwords stored using `bcrypt`.
        - Secrets stored in environment variables.
        - TOTP secrets stored in the database (encryption recommended for future).

- **Source tree components touched:**
    - `src/app/api/auth/[...nextauth]/route.ts`
    - `src/app/(auth)/login/page.tsx`
    - `src/app/(auth)/login/login-form.tsx`
    - `src/lib/auth.ts`
    - `src/lib/db/schema.ts`
    - `src/server/routers/auth.ts`
    - `src/server/routers/totp.ts`

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### Completion Notes List

- **Implementation Details:**
    - Upgraded to NextAuth v5 to resolve import issues with `getServerSession`.
    - Implemented a custom Login UI using Tailwind CSS and Vazirmatn font, strictly following the provided mockups.
    - Added TOTP support:
        - Schema updated to include `totp_secret` and `totp_enabled`.
        - `login-form.tsx` handles `TOTP_REQUIRED` error by showing a secondary input for the 6-digit code.
        - `lib/auth.ts` verifies the TOTP code if enabled for the user.
    - Downgraded `otplib` to v12 to avoid ESM/CJS compatibility issues in the Next.js server environment.
    - Created database migration scripts (`db:generate`, `db:migrate`, `db:seed`) to facilitate setup.

### File List

- `package.json`
- `pnpm-lock.yaml`
- `drizzle.config.ts`
- `src/app/(auth)/login/login-form.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/trpc/[trpc]/route.ts`
- `src/app/_trpc/client.ts`
- `src/app/_trpc/provider.tsx`
- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/lib/auth.ts`
- `src/lib/db/index.ts`
- `src/lib/db/schema.ts`
- `src/lib/utils.ts`
- `src/server/context.ts`
- `src/server/index.ts`
- `src/server/routers/totp.ts`
- `src/server/trpc.ts`
- `src/types/next-auth.d.ts`
- `tsconfig.json`
- `drizzle/0000_open_maria_hill.sql`
- `drizzle/meta/0000_snapshot.json`
- `drizzle/meta/_journal.json`
- `verification/login_page.png`
- `verification/verify_login.py`
- `dev.log`
