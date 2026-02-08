## 1. Database and Environment Setup

- [ ] 1.1 Update the `users` table in the database schema to include `phone_number`, `national_code`, and `password_hash` fields.
- [ ] 1.2 Add `bcrypt` as a dependency to `package.json` for password hashing.
- [ ] 1.3 Configure environment variables for NextAuth.js secret and other sensitive data.

## 2. Backend Implementation (NextAuth.js and tRPC)

- [ ] 2.1 Create the `src/lib/auth.ts` file and configure NextAuth.js with the Credentials provider.
- [ ] 2.2 Implement the `authorize` function within the Credentials provider to handle user authentication against the database using phone number/national code and password.
- [ ] 2.3 Use `bcrypt` to compare the provided password with the stored `password_hash`.
- [ ] 2.4 Create the NextAuth.js API route handler at `src/app/api/auth/[...nextauth]/route.ts`.
- [ ] 2.5 Create a new tRPC router for authentication at `src/server/routers/auth.ts`.
- [ ] 2.6 Add a `login` procedure to the `auth` router that encapsulates the NextAuth.js sign-in logic.
- [ ] 2.7 Add the new `auth` router to the main tRPC router in `src/app/api/trpc/[trpc]/route.ts`.

## 3. Frontend Implementation (Login Page)

- [ ] 3.1 Create the login page component at `src/app/(auth)/login/page.tsx`.
- [ ] 3.2 Build the login form with fields for "Phone Number / National Code" and "Password".
- [ ] 3.3 Implement state management for the form inputs.
- [ ] 3.4 Add client-side validation for the form fields.

## 4. Integration and Finalization

- [ ] 4.1 Connect the login form's submission handler to the tRPC `login` procedure.
- [ ] 4.2 Implement logic to handle successful login, including redirecting the user to the dashboard.
- [ ] 4.3 Implement error handling to display appropriate messages for failed login attempts (e.g., "Invalid credentials").
- [ ] 4.4 Create a protected route and verify that users without a valid session are redirected to the login page.
- [ ] 4.5 Write unit or integration tests for the authentication logic.
