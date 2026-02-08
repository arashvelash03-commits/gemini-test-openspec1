# Story 1.1: user-login-with-phone-number-national-code-and-password

Status: ready-for-dev



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



## Tasks / Subtasks



- [ ] **Backend:** Create tRPC procedure for authentication.

  - [] Implement input validation for phone number/national code and password.

    - [] Hash the provided password and compare it with the stored hash in the `users` table.

      - [] On successful authentication, generate a session token using NextAuth.js and create a session in the `sessions` table.

    - [] **Backend:** Create tRPC procedure for authentication.

      - [] Implement input validation for phone number/national code and password.

      - [] Hash the provided password and compare it with the stored hash in the `users` table.

      - [] On successful authentication, generate a session token using NextAuth.js and create a session in the `sessions` table.

    - [] **Frontend:** Create the login page.

      - [] Create a form with fields for phone number/national code and password.

      - [] Implement a submit handler that calls the tRPC mutation.

      - [] On successful login, redirect the user to their role-specific dashboard.

      - [] Display error messages returned from the server.

    - [] **Database:**

        - [] The `users` table should be used for storing user information, including `phone_number`, `national_code`, and `password_hash`.

        - [] The `sessions` and `accounts` tables are also required for NextAuth.js integration.

    

    ## Dev Notes

    

    - **Relevant architecture patterns and constraints:**

        - **Tech Stack:** Next.js, NextAuth.js, tRPC, PostgreSQL, PowerSync.

        - **Authentication:** Use NextAuth.js with the Credentials provider. 2FA is mandatory for staff, but this story only covers the initial password-based login.

        - **API:** Create a tRPC procedure for login.

        - **Routing:** strict adherence to Next.js App Router. Do not create a pages directory. Create the user page at src/app/admin/users/page.tsx and use layout.tsx for the admin sidebar.

        - **Database:** Use PostgreSQL with the schema defined in appendix-a-detailed-database-schema of `architecture.md`. Use `snake_case` for table and column names.

        - **Security:**

            - Store passwords as hashes (e.g., using bcrypt).

            - Use HTTPS.

            - Store secrets in environment variables.

            - Set a strong `NEXTAUTH_SECRET`.

            - All ePHI must be encrypted at rest and in transit (NFR6).

            - The system must be fully compliant with all HIPAA security and privacy rules (NFR7).

    - **Source tree components to touch:**

        - `src/app/api/trpc/[trpc]/route.ts` (to add the new procedure)

        - `src/server/routers/auth.ts` (or create a new router for auth)

        - `src/app/(auth)/login/page.tsx` (create a new page for login)

        - `src/lib/auth.ts` (to configure NextAuth.js options)

        - `src/app/api/auth/[...nextauth]/route.ts` (the App Router handler)

        - `src/lib/db.ts` (to interact with the database)

    - **Testing standards summary:**

        - Not specified in `epics.md`. General best practice is to add unit tests for the tRPC procedure and integration tests for the login flow.

    

    ### Project Structure Notes

    

    - Follow the existing Feature-Based project organization.

    - Create a new `auth` feature folder under `src/features` if it doesn't exist.

    

    ### References


    - [Source: `architecture.md`]
    - [Source: `ux-design-specification.md` - ]
    - [Source: Web research on Next.js, NextAuth.js, and tRPC best practices]

    

    ## Dev Agent Record

    

    ### Agent Model Used

    

    {{agent_model_name_version}}

    

    ### Debug Log References

    

    ### Completion Notes List
    
    ### File List
