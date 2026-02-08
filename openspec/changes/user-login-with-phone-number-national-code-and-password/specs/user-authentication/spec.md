## ADDED Requirements

### Requirement: User Login with Phone Number and Password
The system SHALL allow a registered user to log in using their phone number and password.

#### Scenario: Successful login with phone number
- **WHEN** a user provides a valid, registered phone number and the correct password
- **THEN** the system SHALL authenticate the user and create a secure session.

#### Scenario: Unsuccessful login with incorrect password (phone number)
- **WHEN** a user provides a valid, registered phone number but an incorrect password
- **THEN** the system SHALL reject the authentication attempt and display a "Invalid credentials" error.

#### Scenario: Unsuccessful login with unregistered phone number
- **WHEN** a user provides a phone number that is not registered in the system
- **THEN** the system SHALL reject the authentication attempt and display a "Invalid credentials" error.

### Requirement: User Login with National Code and Password
The system SHALL allow a registered user to log in using their national code and password.

#### Scenario: Successful login with national code
- **WHEN** a user provides a valid, registered national code and the correct password
- **THEN** the system SHALL authenticate the user and create a secure session.

#### Scenario: Unsuccessful login with incorrect password (national code)
- **WHEN** a user provides a valid, registered national code but an incorrect password
- **THEN** the system SHALL reject the authentication attempt and display a "Invalid credentials" error.

#### Scenario: Unsuccessful login with unregistered national code
- **WHEN** a user provides a national code that is not registered in the system
- **THEN** the system SHALL reject the authentication attempt and display a "Invalid credentials" error.

### Requirement: Secure Session Management
The system MUST establish a secure session for the user upon successful authentication.

#### Scenario: Session creation after login
- **WHEN** a user is successfully authenticated
- **THEN** the system SHALL generate a secure session token and store it.

#### Scenario: Accessing a protected route with a valid session
- **WHEN** a user with a valid session attempts to access a protected resource
- **THEN** the system SHALL grant access to the resource.

#### Scenario: Accessing a protected route without a valid session
- **WHEN** a user without a valid session attempts to access a protected resource
- **THEN** the system SHALL redirect the user to the login page.
