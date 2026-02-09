# AGENTS.md

> **CRITICAL INSTRUCTION FOR AI AGENTS:**
> Before generating any code or executing any task, you **MUST** read and index the following three documentation files found in this repository. These files contain the absolute rules for Architecture, Design, and Project Scope.
>
> **You are strictly forbidden from deviating from the patterns, constraints, and decisions recorded in these files.**

## 1. The Architecture Constitution
**File:** `brief_files/architecture.md`

**You must strictly adhere to:**

* **Core Tech Stack (2026 Stable Targets):**
    * **Next.js:** v16.1+ (LTS) [Latest Stable]
    * **PostgreSQL:** v18.1+ [Latest Stable]
    * **PowerSync SDK:** v1.32+ (Web Client) [Latest Stable]
    * **tRPC:** v11.10+ [Latest Stable]
    * **Auth.js (NextAuth):** v5.0+ [Latest Stable]
    * **React:** v19.2+ [Latest Stable]
    * **Node.js:** v24 (LTS "Krypton")

* **Essential Utilities (Must Use):**
    * **Zod:** v4.0+ (Schema Validation) [Strict Requirement for all Inputs]
    * **Drizzle ORM:** v1.0+ (Server-side Database Access)
    * **TanStack Query:** v5.0+ (Client-side Async State)
    * **React Hook Form:** v7.55+ (Form Management)
    * **Lucide React:** Latest (Iconography)
    * **Tailwind Merge (tw-merge) & clsx:** Latest (Class management)

* **Directory Structure:** The "Feature-Based" folder structure defined in Section 5.2.
* **Data Boundaries:** The strict separation between Server-Side (`src/lib/db`) and Client-Side (`src/lib/powersync`) data access.
* **Naming Conventions:** `snake_case` for DB, `camelCase` for TS.

## 2. The UX & UI Specification
**File:** `brief_files/ux-design-specification.md`

**You must strictly adhere to:**
* **Visual Truth:** The `.png` files in `brief_files/ui-refs/` are the absolute visual target.
* **Implementation Truth:** The `.html` files in `brief_files/ui-refs/` are the source for Tailwind utility classes.
* **Design System:** Tailwind CSS v4 usage (no config file, `@theme` in CSS).
* **Component Strategy:** Use the specific custom components (e.g., "Patient Queue Card") defined in the spec.

## 3. The Project Epics & Requirements
**File:** `brief_files/epics.md`

**You must strictly adhere to:**
* **Requirements:** Ensure every line of code maps to a specific User Story or Functional Requirement (FR).
* **Acceptance Criteria:** Code is not complete until it satisfies the specific "Given/When/Then" criteria listed for the active Story.
* **Scope:** Do not implement features not explicitly listed in the active Epic.

---

### How to Execute a Task (BMAD Workflow)

1.  **Read the Story:** Locate the active story file in `.bmad/stories/` (e.g., `1-1-user-login...md`). and find mockups of that story from `brief_files/ui-refs/` (e.g., `1-2-enforce-mandatory-2fa-for-staff-ui.html`, `1-2-enforce-mandatory-2fa-for-staff-ui.png`).
2.  **Cross-Reference:** Check the **Dev Notes** in that story file against `architecture.md` to ensure no conflicts.
3.  **Implement:** Write code that satisfies the story's Acceptance Criteria while following the patterns in `architecture.md`.
4.  **Verify UI:** Compare your generated UI code against the constraints in `ux-design-specification.md`.
5.  **Log:** Update the "Dev Agent Record" in the story file upon completion.
