---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - C:\Users\FATER\Desktop\reyzone\gemini-test\_bmad-output\planning-artifacts\prd.md
  - C:\Users\FATER\Desktop\reyzone\gemini-test\_bmad-output\planning-artifacts\architecture.md
  - C:\Users\FATER\Desktop\reyzone\gemini-test\_bmad-output\planning-artifacts\ux-design-specification.md
---

# gemini-test - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for gemini-test, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: A clerk can register a new patient, providing their essential demographic information.
FR2: A clerk can upload and manage scanned documents associated with a patient's profile.
FR3: A doctor can view a patient's summary, which includes their demographic information, chief complaint for the current visit, and a list of recent medications and allergies.
FR4: A doctor can view a visual timeline of a patient's medical history.
FR5: A clerk can schedule a new appointment for a patient.
FR6: A clerk can view the clinic's schedule in a calendar-based format.
FR7: A clerk can check-in a patient who has arrived for their appointment.
FR8: The system can send automated SMS reminders to patients 3 days and 1 day before their scheduled appointment.
FR9: The system can notify a doctor in real-time when their patient has been checked in.
FR10: A doctor can view a real-time dashboard with an overview of the day's appointments and patient statuses.
FR11: A clerk can view a dashboard with an overview of the day's statistics, patient list, and tasks.
FR12: A clerk can create, view, and manage tasks.
FR13: A doctor can create, view, and manage tasks, and can assign tasks to a clerk.
FR14: A patient can view a list of their past and upcoming visits.
FR15: A patient can view the prescription codes associated with each of their past visits.
FR16: The system can send an SMS to the patient with a link to the patient portal after their visit.
FR17: The system can enforce role-based access control to ensure users can only access information and features appropriate for their role (clerk, doctor, patient).
FR18: The system can maintain a secure, immutable audit log of all access to electronic Protected Health Information (ePHI).
FR19: The system can encrypt all ePHI at rest and in transit.
FR20: The system's user interface can be responsive and optimized for the primary device of each user role (PC for clerks, tablets for doctors, smartphones for patients).
FR21: The patient portal can meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard.

### NonFunctional Requirements

NFR1: All user actions within the application must complete within 2 seconds under normal network conditions.
NFR2: The application must remain responsive and usable in offline or low-connectivity environments.
NFR3: The doctor's real-time dashboard must update within 1 second of a patient check-in.
NFR4: The patient timeline and other data-intensive views must load and be interactive within 3 seconds, even for patients with 10+ years of medical history, without blocking user interaction.
NFR5: The user interface must always respond to user input (e.g., clicks, scrolling) in under 200 milliseconds, even when loading large amounts of data in the background. This will be achieved through asynchronous data loading.
NFR6: All electronic Protected Health Information (ePHI) must be encrypted at rest and in transit to meet industry security standards.
NFR7: The system must be fully compliant with all HIPAA security and privacy rules.
NFR8: The system must ensure that users can only access information and features appropriate for their role, adhering to the principle of least privilege.
NFR9: The system must support up to 100 concurrent users (clerks and doctors) per clinic without a significant degradation in performance.
NFR10: The system architecture must be designed to support a 10x growth in the number of patients and clinics over a 2-year period with minimal performance degradation.
NFR11: The patient portal must meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard.
NFR12: The core features of the system must have a 99.9% uptime.
NFR13: The offline data synchronization mechanism must ensure data consistency and integrity.

### Additional Requirements

*   **Starter Template:** Manual Stack Composition using Next.js, PostgreSQL, PowerSync, and SQLite.
*   **Initialization Commands:**
    *   `npx create-next-app@latest`
    *   `docker run -d --name my-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -v pgdata:/var/lib/postgresql/data postgres`
    *   PowerSync service via Docker Compose.
    *   `npm install @powersync/react @powersync/web @journeyapps/wa-sqlite`
*   **Data Architecture:** PostgreSQL as the main database, `JSONB` for flexible data, PowerSync for offline sync with SQLite on client devices, standard relational data modeling.
*   **Authentication & Security:** Username/Password + 2FA (TOTP) with NextAuth.js and PostgreSQL; 2FA mandatory for staff, optional for patients; Role-Based Access Control (RBAC).
*   **API & Communication Patterns:** PowerSync for primary data sync; tRPC for server-side operations.
*   **Naming Patterns:** `snake_case` for PostgreSQL, `camelCase` for TypeScript, with boundary transformation.
*   **Structure Patterns:** Feature-Based project organization.
*   **Format Patterns:** Standard `{ code, message, details }` for tRPC API errors.
*   **Process Patterns:** Loading state handling with disabled buttons/spinners for actions and skeleton loaders for data loading.
*   **Project Structure & Boundaries:** Defined project directory structure; PowerSync client as data boundary; tRPC API as API boundary.
*   **Key Design Challenges:** Address information overload, ensure seamless workflow integration, provide a robust offline-first experience, optimize for multi-device responsiveness, and empower patients with clarity.
*   **Core User Experience:** The defining experience is an "intelligent, visual timeline" that shifts the user's mental model from "data hunter" to "clinical decision-maker."
*   **Desired Emotional Response:** The primary goal is to make all users feel "empowered and intelligently supported."
*   **UX Pattern Analysis & Inspiration:** Adopt patterns like card-based dashboards, real-time feedback, integrated AI assistance, visual timelines, and efficient task management. Avoid information overload, generic AI responses, inconsistent UI/UX, and slow performance.
*   **Design System Foundation:** Use Material UI (MUI) for its accelerated development, customization, responsiveness, accessibility, and RTL support.
*   **User Journey Flows:** Implement specific user journeys for doctors, clerks, and patients, focusing on dashboard-centric entry, contextual drill-down, AI-assisted decision making, real-time status updates, and clear action points.
*   **Component Strategy:** Develop custom components like the "Intelligent Visual Patient Timeline," "Patient Queue Card," and "AI Assistant Chat Interface" to deliver the core experience.
*   **UX Consistency Patterns:** Establish clear patterns for button hierarchy, feedback, forms, navigation, empty/loading states, and search/filtering.

### FR Coverage Map

FR1: Epic 2 - Comprehensive Patient Records
FR2: Epic 2 - Comprehensive Patient Records
FR3: Epic 2 - Comprehensive Patient Records
FR4: Epic 2 - Comprehensive Patient Records
FR5: Epic 3 - Efficient Appointment & Schedule Management
FR6: Epic 3 - Efficient Appointment & Schedule Management
FR7: Epic 3 - Efficient Appointment & Schedule Management
FR8: Epic 5 - Patient Engagement & Communication
FR9: Epic 4 - Real-Time Clinic Operations & Task Management
FR10: Epic 4 - Real-Time Clinic Operations & Task Management
FR11: Epic 4 - Real-Time Clinic Operations & Task Management
FR12: Epic 4 - Real-Time Clinic Operations & Task Management
FR13: Epic 4 - Real-Time Clinic Operations & Task Management
FR14: Epic 5 - Patient Engagement & Communication
FR15: Epic 5 - Patient Engagement & Communication
FR16: Epic 5 - Patient Engagement & Communication
FR17: Epic 1 - Foundation & Secure Access
FR18: Epic 1 - Foundation & Secure Access
FR19: Epic 1 - Foundation & Secure Access
FR20: Epic 2, Epic 3, Epic 4, Epic 5 - Responsive UI across relevant user roles
FR21: Epic 5 - Patient Engagement & Communication

## Epic List

### Epic 1: Foundation & Secure Access
Users (clerks, doctors, patients) can securely register, log in, and manage their profiles.
**FRs covered:** FR17, FR18, FR19

### Epic 2: Comprehensive Patient Records
Clerks can create and manage comprehensive patient records, and doctors can instantly access a patient's complete medical history through a visual timeline.
**FRs covered:** FR1, FR2, FR3, FR4, FR20 (for doctor and clerk views)
**Implementation Notes:** For document management (FR2), we will use a local S3-compatible file storage solution.

### Epic 3: Efficient Appointment & Schedule Management
Clerks can efficiently manage the clinic's schedule, book appointments, and check-in patients, reducing wait times and improving clinic flow.
**FRs covered:** FR5, FR6, FR7, FR20 (for clerk views)

### Epic 3.5: Advanced Session-Based Scheduling
Doctors can define their work/rest schedules, and clerks can manage appointments within system-generated "session intervals," with features for re-ordering patients and sending final visit times.
**FRs covered:** (New FRs to be defined)

### Epic 4: Real-Time Clinic Operations & Task Management
Doctors and clerks can stay informed with real-time dashboards and notifications, and can effectively manage and collaborate on tasks.
**FRs covered:** FR9, FR10, FR11, FR20 (for doctor and clerk views)

### Epic 5: Patient Engagement & Communication
Patients are kept informed with automated reminders, and can easily access their visit history and prescription information through a secure portal.
**FRs covered:** FR8, FR14, FR16, FR20 (for patient portal), FR21

### Epic 1: Foundation & Secure Access
Users (admins, clerks, doctors, patients) can securely log in and are provisioned with appropriate access based on a strict role-based hierarchy. No public registration endpoints.
**FRs covered:** FR17, FR18, FR19

### Story 1.4: Admin-Led User Provisioning
As a system administrator,
I want to create, view, and manage Doctor and Clerk user accounts via a dedicated Admin Panel,
So that initial user provisioning is controlled and secure.

**Acceptance Criteria:**

*   **Given** a user with the role of system administrator,
*   **When** they access the Admin Panel,
*   **Then** they can create a new user with a unique phone number or national code, a strong password, and an assigned role of either "Doctor" or "Clerk".
*   **And** a `created_by` field is populated with the administrator's user ID.
*   **And** an error is shown if the phone number or national code is already in use.
*   **And** they can view a list of all Doctors and Clerks.
*   **And** they can edit or deactivate Doctor and Clerk accounts.

### Story 1.5 (Revised): Doctor-Led Staff Provisioning (Extensible)
As a Doctor,
I want to create and manage accounts for my clinic staff (currently Clerks, with future support for Nurses/Assistants/Doctors),
So that I can build my team and delegate access appropriate to their roles.

**Acceptance Criteria:**

* **Given** a user with the role of "Doctor",
* **When** they access their user management interface,
* **Then** they can create a new user and select their role from a list (currently restricted to "Clerk", but architected to support Nurse/Assistant/Doctor in future updates).
* **And** a `created_by` field is populated with the Doctor's user ID to establish hierarchy.
* **And** they can view a list of all staff members they have created.
* **And** they can edit or deactivate the accounts of staff members they have created.

### Story 1.6: Clerk-Led Patient Provisioning
As a Clerk,
I want to create, view, and manage Patient user accounts,
So that I can register new patients for the clinic.

**Acceptance Criteria:**

*   **Given** a user with the role of "Clerk",
*   **When** they access their user management interface,
*   **Then** they can create a new user with the role of "Patient".
*   **And** a `created_by` field is populated with the Clerk's user ID.
*   **And** they can view a list of all Patients they have created.
*   **And** they can edit or deactivate the accounts of Patients they have created.

### Story 1.1: User Login with Phone Number/National Code and Password
As a registered user,
I want to log in with my phone number or national code and password,
So that I can access the system.

**Acceptance Criteria:**

*   **Given** a registered user with a valid phone number or national code and password,
*   **When** they enter their credentials on the login page,
*   **Then** they are successfully authenticated and redirected to their role-specific dashboard.
*   **And** an error message is shown for invalid credentials.

### Story 1.2: Enforce Mandatory 2FA for Staff
As a system administrator,
I want to enforce mandatory Two-Factor Authentication (2FA) for all staff roles (doctors and clerks),
So that sensitive patient data is protected with an additional layer of security.

**Acceptance Criteria:**

*   **Given** a staff user (doctor or clerk) attempts to log in,
*   **When** their initial login credentials are valid,
*   **Then** they are prompted to set up 2FA if not already configured.
*   **And** they are required to provide a valid 2FA code to complete the login process.
*   **And** patients are not required to use 2FA.

### Story 1.3 (Revised): User Profile and 2FA Management
As a registered user,
I want to view and update my personal profile information (e.g., password, contact details) and manage my 2FA settings,
So that my account information is accurate and secure.

**Acceptance Criteria:**

*   **Given** a logged-in user,
*   **When** they navigate to their profile settings,
*   **Then** they can view their current profile information.
*   **And** they can update editable fields (e.g., password, phone number, national code).
*   **And** changes are saved securely and reflected in their profile.
*   **And** password changes require re-authentication or current password confirmation.
*   **And** they can request a reset of their 2FA key through a secure process.
*   **And** upon successful 2FA reset, their old key is invalidated and they are provided with a new key.

### Story 1.7: Secure Audit Logging
As a system administrator,
I want the system to maintain a secure, immutable audit log of all access to electronic Protected Health Information (ePHI),
So that I can track and verify compliance with security regulations.

**Acceptance Criteria:**

*   **Given** any user accesses or modifies ePHI within the system,
*   **When** the action occurs,
*   **Then** an entry is automatically recorded in an immutable audit log.
*   **And** the log entry includes the user's identity, the action performed, the timestamp, and the specific ePHI accessed or modified.
*   **And** the audit log is protected from unauthorized modification or deletion.

## Epic 2: Comprehensive Patient Records
Clerks can create and manage comprehensive patient records, and doctors can instantly access a patient's complete medical history through a visual timeline.

### Story 2.1: Patient Registration
As a clerk,
I want to register a new patient by providing their essential demographic information,
So that a new patient record is created in the system.

**Acceptance Criteria:**

*   **Given** a clerk is logged into the system,
*   **When** they navigate to the patient registration page and enter the patient's demographic information (e.g., name, phone number, national code),
*   **Then** a new patient record is created in the database.
*   **And** the clerk is redirected to the newly created patient's profile page.
*   **And** an error is shown if a patient with the same phone number or national code already exists.

### Story 2.2 (Revised): Document Upload and Management with Categorization and Tagging
As a clerk,
I want to upload and manage scanned documents associated with a patient's profile, with the ability to categorize, date, and tag them,
So that all relevant patient information is centrally accessible and easily searchable.

**Acceptance Criteria:**

*   **Given** a clerk is viewing a patient's profile,
*   **When** they upload one or more scanned documents (e.g., PDF, image),
*   **Then** they are prompted to select a category for the document(s) (e.g., Lab Result, Referral, Imaging).
*   **And** they can select or enter the date of the document(s).
*   **And** they can add one or more tags to the document(s) (e.g., #ct, #mri).
*   **And** the document(s) are securely stored (e.g., in local S3-compatible storage) and linked to the patient's record with the associated metadata (category, date, tags).
*   **And** the clerk can view a list of uploaded documents for that patient, with their metadata.
*   **And** the clerk can download or delete uploaded documents (with appropriate permissions).
*   **And** the system handles various document types (e.g., PDF, JPG, PNG).

### Story 2.3 (Revised): Dynamic Patient Summary View
As a doctor,
I want to view a dynamic patient summary that includes demographic information, chief complaint, recent medications, allergies, and specific items I or an AI agent have selected,
So that I can quickly get essential and personalized context for the current visit.

**Acceptance Criteria:**

*   **Given** a doctor is viewing a patient's profile,
*   **When** they access the patient summary view,
*   **Then** they see the patient's demographic information (e.g., name, age, gender).
*   **And** they see the chief complaint for the current visit.
*   **And** they see a list of recent medications.
*   **And** they see a list of known allergies.
*   **And** they see a section with "Pinned Items" that displays specific information (e.g., a bone marrow result, a specific lab value) that has been previously selected by the doctor or an AI agent.
*   **And** the doctor has a mechanism to "pin" or "unpin" items to this summary view from other parts of the patient's record.
*   **And** the view is responsive and optimized for tablet devices (FR20).

### Story 2.4 (Revised): Interactive and Filterable Visual Patient Timeline
As a doctor,
I want to view and interact with a visual timeline of a patient's medical history,
So that I can quickly understand the progression of their conditions and treatments over time.

**Acceptance Criteria:**

*   **Given** a doctor is viewing a patient's profile,
*   **When** they access the patient timeline view,
*   **Then** they see a chronological, interactive display of "cards" representing key medical events.
*   **And** there are different types of cards, including "Document Cards" (for uploaded files/groups of files) and "Note Cards" (for notes added by the doctor).
*   **And** each card on the timeline provides a concise summary.
*   **And** the doctor can click on a card to view detailed information and access associated documents.
*   **And** the doctor can filter the timeline by card category (e.g., Lab Result, Referral, Note) and by tags (e.g., #ct, #mri).
*   **And** the timeline is responsive and optimized for tablet devices (FR20).
*   **And** the timeline loads and is interactive within 3 seconds, even for patients with extensive history (NFR4).

### Story 2.5: Clerk's Patient Information View
As a clerk,
I want to see a consolidated view of a patient's key information on their page, including demographic info, previous visits, and any warnings,
So that I can efficiently handle administrative tasks and inquiries.

**Acceptance Criteria:**

*   **Given** a clerk is viewing a patient's page,
*   **When** the page loads,
*   **Then** they can see a card displaying the patient's demographic information.
*   **And** they can see a card listing the patient's previous visits with their dates and codes.
*   **And** they can see a card displaying any individual warnings associated with the patient.
*   **And** this view is presented alongside the document upload and list functionality.
*   **And** the view is responsive and optimized for PC devices (FR20).

## Epic 3: Efficient Appointment & Schedule Management
Clerks can efficiently manage the clinic's schedule, book appointments, and check-in patients, reducing wait times and improving clinic flow.

### Story 3.1 (Revised): Schedule Appointment from Patient Page with Session Selection and Availability Checklist
As a clerk,
I want to schedule a new appointment for a specific patient from their page by selecting a session and capturing their availability for changes using a checklist,
So that I can efficiently and flexibly book their next visit.

**Acceptance Criteria:**

*   **Given** a clerk is viewing a patient's page,
*   **When** they initiate scheduling a new appointment,
*   **Then** they can select the type of visit.
*   **And** they can select a date for the appointment.
*   **And** the system displays available session intervals for that date.
*   **And** the clerk can select a session interval for the appointment.
*   **And** the system displays a checklist of time slots for the day (e.g., hourly from 13:00 to 20:00).
*   **And** the selected session interval is automatically checked as "available" in the checklist.
*   **And** the clerk can check additional time slots in the checklist to record the patient's secondary availability.
*   **And** upon confirmation, the appointment is created and linked to the patient, with their availability checklist stored.
*   **And** the view is responsive and optimized for PC devices (FR20).

### Story 3.2 (Revised): Interactive Calendar-Based Schedule View with Patient Availability Checklist

As a clerk,
I want to view the clinic's schedule in an interactive calendar-based format and add appointments directly from it, capturing patient availability using a checklist,
So that I can easily manage appointments and available time slots.

**Acceptance Criteria:**

*   **Given** a clerk is logged into the system,
*   **When** they navigate to the clinic's schedule view,
*   **Then** they see a calendar displaying appointments for all doctors.
*   **And** they can switch between day, week, and month views.
*   **And** available time slots are clearly visible.
*   **And** when they click on an available time slot, a form appears where they can enter a patient's national code to identify them.
*   **And** they can select the type of visit for the new appointment.
*   **And** the system displays a checklist of time slots for the day (e.g., hourly from 13:00 to 20:00).
*   **And** the selected session interval is automatically checked as "available" in the checklist.
*   **And** the clerk can check additional time slots in the checklist to record the patient's secondary availability.
*   **And** upon confirmation, the appointment is created and added to the schedule, with their availability checklist stored.
*   **And** the view is responsive and optimized for PC devices (FR20).

### Story 3.3 (Revised): Patient Check-in (with temporary UI)
As a clerk,
I want to check-in a patient who has arrived for their appointment,
So that the doctor is notified and the patient's status is updated.

**Acceptance Criteria:**

*   **Given** a patient has an upcoming appointment,
*   **When** a clerk triggers the "Check-in" action for that patient (e.g., by clicking a "Check-in" button on the patient's detail page),
*   **Then** the patient's status is updated to "Checked-in" throughout the system.
*   **And** the assigned doctor receives a real-time notification that their patient has checked in.
*   **And** the clerk can optionally confirm or update patient details as part of the check-in process.
*   **And** the check-in functionality is responsive and optimized for PC devices (FR20).

## Epic 3.5: Advanced Session-Based Scheduling
Doctors can define their work/rest schedules, and clerks can manage appointments within system-generated "session intervals," with features for re-ordering patients and sending final visit times.

### Story 3.5.1 (Revised): Doctor's Routine Schedule Configuration
As a doctor,
I want to define my routine daily work schedule, including arrival/leaving times, work/rest intervals, and fixed breaks,
So that the system can accurately generate my availability for patient sessions until I make a change.

**Acceptance Criteria:**

*   **Given** a doctor is on their schedule configuration page,
*   **When** they set their typical arrival/leaving times, work/rest intervals, and fixed breaks for each day of the week,
*   **Then** this is saved as their routine schedule.
*   **And** this routine schedule remains active indefinitely until explicitly modified by the doctor.
*   **And** the system will use this routine to generate session intervals for all future days unless a daily override is applied.

### Story 3.5.2: Daily Schedule Overrides
As a doctor,
I want to be able to make one-off changes to my schedule for a specific day,
So that I can override my routine schedule for exceptions like holidays or personal appointments.

**Acceptance Criteria:**

*   **Given** a doctor is viewing their schedule for a future day (e.g., in a calendar view),
*   **When** they choose to modify the schedule for that specific day,
*   **Then** they can change their arrival/leaving times, add or remove breaks, or block out time for that day only.
*   **And** these changes override the routine schedule for that day.
*   **And** the system will regenerate the session intervals for that day based on the updated schedule.

### Story 3.5.3 (Revised): Visit Type Configuration
As a doctor,
I want to define and manage different types of visits, including categories, subcategories, estimated times, and complexity levels,
So that appointments can be accurately scheduled and managed within session intervals.

**Acceptance Criteria:**

*   **Given** a doctor is on their schedule configuration screen,
*   **When** they access the visit type management section,
*   **Then** they can create main categories for visits (e.g., "Consultation", "Procedure").
*   **And** for each main category, they can create subcategories.
*   **And** for each visit type (category/subcategory), they can set an estimated duration.
*   **And** they can assign a complexity level to each visit type.
*   **And** these visit type configurations are saved and available for scheduling.

### Story 3.5.4: System Generation of Session Intervals
As a system,
I want to automatically generate available session intervals for each doctor based on their configured routine schedule and any daily overrides,
So that clerks can efficiently assign appointments.

**Acceptance Criteria:**

*   **Given** a doctor has configured their routine work schedule and potentially daily overrides for a specific day,
*   **When** the system processes this configuration for that day,
*   **Then** it generates a series of distinct session intervals, respecting work/rest ratios, fixed breaks, and any daily overrides.
*   **And** these session intervals are made available for clerks to assign appointments.
*   **And** the system ensures that no session interval overlaps with a fixed break or a rest period.

### Story 3.5.5 (Revised): Smart Assignment of Appointments to Sessions with Category Limits
As a clerk,
I want to assign a patient's appointment to a suitable session interval, with the system guiding me to available options and respecting visit category limitations,
So that the appointment is scheduled efficiently according to the doctor's availability and visit type constraints.

**Acceptance Criteria:**

*   **Given** a clerk is scheduling an appointment for a patient,
*   **When** they select a date and a visit type for the appointment,
*   **Then** the system automatically displays a list of available session intervals for that date and doctor, where the estimated duration of the selected visit type fits.
*   **And** the system also considers any pre-defined limitations for specific visit categories within each session (e.g., maximum number of "Procedure" visits per session).
*   **And** the clerk can then select one of the suggested available session intervals.
*   **And** upon selection, the appointment is tentatively placed within that session.
*   **And** the clerk can see the remaining available time within each session interval.
*   **And** if no suitable session intervals are available (due to time or category limits), the system provides appropriate feedback.

### Story 3.5.6 (Revised): Dynamic Session Management and Submission by Clerk
As a clerk, a few days before an appointment,
I want to dynamically manage and re-order patients within each session, adjust session timings, and submit the proposed schedule for doctor's approval,
So that the day's schedule is optimized and ready for review.

**Acceptance Criteria:**

*   **Given** a clerk is viewing the session management view for a future day,
*   **Then** they see a visual representation of each session as a line, with boxes representing individual patient appointments.
*   **And** the size of each box visually indicates the estimated time of the visit.
*   **And** the clerk can re-order patients within a session using drag-and-drop.
*   **And** the clerk can adjust the start/end times of sessions or fixed breaks.
*   **And** if a change moves a patient's appointment time, the system checks for conflicts with the patient's stated availability and provides a warning.
*   **And** the system can offer suggestions for optimal ordering (system assist).
*   **And** when the clerk is satisfied, they can submit the proposed schedule for the doctor's approval.
*   **And** the system notifies the doctor that a schedule is ready for review.

### Story 3.5.7: Doctor's Review and Approval of Daily Schedule
As a doctor,
I want to review, modify, and approve the daily schedule proposed by the clerk,
So that I have final control over my day's workflow.

**Acceptance Criteria:**

*   **Given** a clerk has submitted a daily schedule for review,
*   **When** the doctor receives a notification and views the proposed schedule,
*   **Then** they can see the ordered list of patients within each session.
*   **And** they can make final adjustments to the schedule if needed.
*   **And** they can approve the schedule.
*   **And** once the doctor approves the schedule, it is considered final.

### Story 3.5.8: Finalizing Session Order and Notifying Patients
As a system, after the doctor approves the daily schedule,
I want to finalize the session order and send exact visit times to patients,
So that patients are informed of their confirmed appointment details.

**Acceptance Criteria:**

*   **Given** the doctor has approved the daily schedule,
*   **When** the schedule is finalized,
*   **Then** the system sends an SMS to each patient with their confirmed exact visit time.
*   **And** the system updates the official schedule with the finalized order and times.

## Epic 4: Real-Time Clinic Operations & Task Management
Doctors and clerks can stay informed with real-time dashboards and notifications, and can effectively manage and collaborate on tasks.

### Story 4.1 (Revised): Clerk's Main Layout with Dynamic Patient Sidebar and Timers

As a clerk,
I want a main application layout with a persistent sidebar that dynamically displays categorized lists of patients for the day, including timers,
So that I can have a constant overview of the daily schedule, manage patient flow, and perform quick actions from any page.

**Acceptance Criteria:**

*   **Given** a clerk is logged into the system,
*   **When** they view any page, a main layout with a header and a persistent sidebar is displayed.
*   **And** the sidebar contains three categorized lists of patients for the day: "In active session," "Waiting in clinic," and "Has appointment but no check-in yet."
*   **And** each patient entry in the lists displays their name, appointment time, and current status.
*   **And** when a patient is checked in, a "waiting time" timer starts and is displayed next to their name in the "Waiting in clinic" list.
*   **And** when a "Start Visit" button is clicked for a patient, a "session time" timer starts and is displayed next to their name in the "In active session" list.
*   **And** each patient entry has quick action buttons (e.g., "Check-in," "Start Visit," "End Session").
*   **And** the patient lists and timers update in real-time as patient statuses change.
*   **And** the layout is responsive and optimized for PC devices (FR20).

### Story 4.2 (Revised): Doctor's Real-Time Dashboard with Comprehensive Key Metric Cards and Patient Timers

**As a** doctor,
**I want** to view a real-time dashboard with an overview of my day's appointments, patient statuses, comprehensive key metric cards, and patient-specific timers,
**So that** I can stay informed, manage my workflow effectively, and quickly grasp critical operational insights about my daily schedule and patient flow.

**Acceptance Criteria:**

*   **Given** a doctor is logged into the system,
*   **When** they navigate to their dashboard,
*   **Then** they see a list of their scheduled appointments for the day, including patient names and appointment times.
*   **And** the status of each patient (e.g., "Confirmed," "Checked-in," "In Session") is clearly displayed and updates in real-time.
*   **And** for patients who are "Waiting in clinic," a "waiting time" timer is displayed next to their name.
*   **And** for patients "In Session," a "session time" timer is displayed next to their name.
*   **And** the dashboard prominently displays informing cards for:
    *   "Time Bank" (indicating whether the doctor is ahead or behind schedule, and by how much).
    *   "Patients in Clinic" (a count of patients currently checked in and waiting).
    *   "Mean Waiting Time" (the average waiting time for patients currently in the clinic).
    *   "Total Appointments" (the total number of appointments scheduled for the day).
    *   "Remaining Appointments" (the number of appointments yet to occur).
*   **And** the dashboard automatically updates within 1 second of a patient check-in (NFR3).
*   **And** the view is responsive and optimized for tablet devices (FR20).

### Story 4.3 (Revised): Actionable "Start Visit" Notification for Doctors

**As a** doctor,
**I want** to receive an actionable, real-time notification when a patient's visit session starts,
**So that** I can immediately engage with their clinical workflow.

**Acceptance Criteria:**

*   **Given** a doctor is logged into the system,
*   **When** a clerk initiates a "Start Visit" for one of the doctor's patients (from the clerk's sidebar in Story 4.1),
*   **Then** the doctor receives an immediate, non-intrusive real-time notification (e.g., a toast message).
*   **And** the notification includes the patient's name.
*   **And** the notification provides three distinct action buttons:
    1.  **"Open Workflow"**: Navigates the doctor directly to the patient's clinical workflow/workspace.
    2.  **"Copy National Code"**: Copies the patient's national code to the clipboard.
    3.  **"Dismiss"**: Closes the notification without taking any other action.
*   **And** the doctor's dashboard (Story 4.2) updates to reflect the patient's "In Session" status.

### Story 4.4 (Revised): Doctor's Clinical Workspace with Collapsible Header and Action Sidebar

**As a** doctor,
**I want** a dedicated clinical workflow workspace for each patient session, featuring a collapsible summary header, a main timeline view, and an action-oriented sidebar,
**So that** I have a powerful and context-rich interface to manage patient care.

**Acceptance Criteria:**

*   **Given** a doctor starts a patient session,
*   **When** the clinical workflow workspace loads,
*   **Then** it displays a collapsible header that functions as the patient summary.
*   **And** the active "session time" timer is clearly visible at all times.
*   **And** in its **collapsed state**, the header displays:
    *   Key patient identifiers (Name, Sex, Age, National Code).
    *   Primary diagnosis and active treatment information.
    *   A row of "most informative short data cards" or tags (e.g., HER2+, Diabetes, T2N1M0).
*   **And** the header contains a toggle arrow button to switch to an expanded state.
*   **And** in its **expanded state**, the header reveals a grid of more detailed summary cards (e.g., Pathology results, key Lab values, Imaging baseline).
*   **And** below the header, the main content area displays the "Interactive Timeline" view (as defined in Story 2.4).
*   **And** a persistent sidebar is displayed with three distinct sections:
    1.  **AI Assistant:** A placeholder for the future AI chat interface.
    2.  **Recommendations & Tasks:** A section to display recommendations and manage tasks related to the patient.
    3.  **Handwriting:** A placeholder for a future handwriting/e-pen input area.
*   **And** the workspace is responsive and optimized for tablet devices (FR20).

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

## Epic 5: Patient Engagement & Communication
Patients are kept informed with automated reminders, and can easily access their visit history and prescription information through a secure portal.
**FRs covered:** FR8, FR14, FR15, FR16, FR20 (for patient portal), FR21

### Story 5.1 (Revised): Clinic-Level SMS Task and Template Management

**As a** clinic manager (doctor or clerk with appropriate permissions),
**I want** a management page to create and manage automated SMS tasks, including their trigger conditions and message templates,
**So that** I can fully configure how and what our clinic communicates to patients via SMS from a single interface.

**Acceptance Criteria:**

*   **Given** a user with "clinic manager" permissions is on the SMS task management page,
*   **When** they create a new SMS task or edit an existing one,
*   **Then** they can define the task's trigger (e.g., select the "BEFORE_APPOINTMENT" trigger type and set the number of days).
*   **And** they are presented with a text area to write the message template for that SMS.
*   **And** they can use predefined placeholders in the template, such as `[patient_name]`, `[appointment_date]`, and `[appointment_time]`, which the system will replace with real data.
*   **And** the system displays a list of available placeholders for the selected trigger type.
*   **And** they can save the task along with its trigger and message template.
*   **And** users without "clinic manager" permissions cannot access this page.

### Story 5.2 (Revised): Automated SMS Task Execution via Third-Party API

**As a** system,
**I want** to automatically process configured SMS tasks and send messages to patients via a third-party API,
**So that** patients receive timely and relevant communications without manual intervention.

**Acceptance Criteria:**

*   **Given** an SMS task is configured and active (via Story 5.1),
*   **When** the system's daily automated process runs,
*   **Then** it identifies all patients who meet the trigger conditions for each active SMS task.
*   **And** for each identified patient, it generates a personalized SMS message using the task's defined template and relevant patient data.
*   **And** the system makes an API call to a designated third-party SMS gateway to send the generated message.
*   **And** the system logs the successful sending of each message, including the message content and recipient.
*   **And** the system handles potential errors during SMS sending (e.g., API errors, invalid phone number) and logs them for review.

### Story 5.3 (Revised): Patient Portal Foundation and Separate Login

**As a** patient,
**I want** to be able to log in to a secure, dedicated patient portal,
**So that** I can access my personal health information through an interface tailored for me.

**Acceptance Criteria:**

*   **Given** a patient has been registered in the system,
*   **When** they navigate to the patient portal URL,
*   **Then** they are presented with a dedicated login page, separate from the doctor and clerk login pages.
*   **And** they can log in using their credentials (phone number/national code and password, as defined in Story 1.2).
*   **And** upon successful login, they are taken to the main dashboard of the patient portal.
*   **And** the patient portal interface is responsive and optimized for smartphone devices (FR20).
*   **And** all pages within the portal meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard (FR21).

### Story 5.4 (Revised): Patient Portal - Detailed Visit History and Upcoming Appointments

**As a** patient,
**I want** to view a detailed list of my past and upcoming visits within the patient portal, including tracking codes and ordered tags for past visits,
**So that** I can comprehensively track my appointments, medical history, and associated orders.

**Acceptance Criteria:**

*   **Given** a patient is logged into the patient portal (via Story 5.3),
*   **When** they navigate to the "My Visits" section (or similar),
*   **Then** they see a clear, chronological list of their past appointments.
*   **And** for each past appointment, basic details like date, time, and doctor are displayed.
*   **And** for each past appointment, a "tracking code" is visible.
*   **And** for each past appointment, relevant "ordered tags" (e.g., #آزمایش, #ام‌آر‌آی, #سی‌تی, #سونو, #دارو) are displayed.
*   **And** they see a clear list of their upcoming appointments.
*   **And** for each upcoming appointment, basic details like date, time, and doctor are displayed.
*   **And** the interface is responsive and optimized for smartphone devices (FR20).
*   **And** the interface meets WCAG 2.1 Level AA standards (FR21).

### Story 5.5 (Revised): Post-Visit SMS with "Magic Link" to Patient Portal

**As a** system,
**I want** to automatically send a detailed SMS to the patient with a time-limited "magic link" to the patient portal after their visit,
**So that** patients can have immediate, hassle-free access to their visit information.

**Acceptance Criteria:**

*   **Given** a patient's visit has concluded,
*   **When** the system triggers the post-visit communication,
*   **Then** it generates a secure, single-use token for the patient that is set to expire after a limited time (e.g., 24 hours) and a limited number of uses (e.g., 3 clicks).
*   **And** it generates a unique "magic link" URL containing this token.
*   **And** it sends an SMS to the patient's registered phone number containing:
    *   The visit's `tracking code`.
    *   The `ordered items tags` (e.g., #آزمایش, #دارو).
    *   The unique "magic link".
*   **And** when the patient clicks the valid "magic link", they are taken directly to their visit summary page within the portal *without needing to log in*.
*   **And** if the patient tries to use an expired or already-used link, they are redirected to the standard patient portal login page.
*   **And** the SMS sending is logged and uses the third-party API (as defined in Story 5.2).