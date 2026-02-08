## Context

This design document outlines the technical approach for implementing user login functionality. The system is built with Next.js, NextAuth.js, tRPC, PostgreSQL, and PowerSync. The primary goal is to enable registered users to authenticate using either their phone number or national code, along with a password, to gain access to the system. This feature is foundational for user interaction and system security.

## Goals / Non-Goals

**Goals:**
- To provide a secure and reliable mechanism for registered users to log in.
- To integrate NextAuth.js for robust session management.
- To establish a clear and type-safe API for authentication using tRPC.
- To create a user-friendly login interface.
- To ensure proper storage of user credentials (hashed passwords) and session information in PostgreSQL.

**Non-Goals:**
- Implementation of multi-factor authentication (MFA) for general users (MFA is mandated for staff but is outside the scope of this story).
- Advanced password policies (e.g., complexity requirements, rotation) beyond secure hashing.
- User registration functionality (assumed users are already registered).

## Decisions

- **Authentication Provider:** The Credentials provider within NextAuth.js will be used. This allows for custom authentication logic where users provide a phone number/national code and password, which are then verified against the database.
- **Password Hashing:** `bcrypt` will be used for hashing user passwords before storage in the database. This ensures that passwords are never stored in plain text, enhancing security.
- **API Endpoint:** A new tRPC procedure will be created within an `auth` router (`src/server/routers/auth.ts`). This procedure will handle the authentication request, validate credentials, and on success, generate a session token.
- **Frontend Login Page:** A dedicated login page (`src/app/(auth)/login/page.tsx`) will be developed. This page will contain a form for users to input their phone number/national code and password. It will interact with the tRPC authentication procedure.
- **Session Management:** NextAuth.js will manage user sessions, including the creation and invalidation of session tokens.
- **Database Schema:** The existing `users` table will be extended to include `phone_number`, `national_code`, and `password_hash` columns. The `sessions` and `accounts` tables, as required by NextAuth.js, will also be utilized.

## Risks / Trade-offs

- **Risk: Security Vulnerabilities:** Incorrect implementation of password hashing, session management, or secret handling could lead to security breaches.
    - **Mitigation:** Adhere strictly to NextAuth.js documentation and best practices. Use environment variables for all secrets. Regularly review security configurations.
- **Risk: Data Validation:** Inadequate input validation for phone numbers, national codes, and passwords could expose the system to malformed data or injection attacks.
    - **Mitigation:** Implement comprehensive server-side input validation within the tRPC procedure.
- **Trade-off: Performance vs. Security:** Strong hashing algorithms like bcrypt are computationally intensive. While secure, this can introduce a slight delay during login.
    - **Mitigation:** This is an acceptable trade-off for enhanced security. Performance will be monitored, and optimizations will be considered if bottlenecks arise.

## Migration Plan

Not applicable, as this is a new feature implementation.

## Open Questions

- What are the specific validation rules for phone numbers and national codes (e.g., format, length, country codes)?
- How should different login failure scenarios (e.g., invalid phone number, incorrect password, account locked) be communicated to the user on the frontend?
- Are there any specific requirements for session expiration or renewal?
