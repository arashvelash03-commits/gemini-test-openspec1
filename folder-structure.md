C:\Users\FATER\Desktop\reyzone\gemini-test-openspec1\
├───.db_url_for_migrate
├───.env.local
├───.gitignore
├───AGENTS.md
├───docker-compose.yml
├───drizzle.config.ts
├───eslint.config.mjs
├───INSTRUCTIONS.txt
├───next-env.d.ts
├───next.config.ts
├───OFFLINE_GUIDE.md
├───package-lock.json
├───package.json
├───pnpm-lock.yaml
├───pnpm-workspace.yaml
├───postcss.config.mjs
├───README_UPDATE.txt
├───README.md
├───TAILWIND_OFFLINE.md
├───tsconfig.json
├───.git\
│   ├───hooks\
│   ├───info\
│   ├───logs\
│   ├───objects\
│   ├───refs\
│   ├───COMMIT_EDITMSG
│   ├───config
│   ├───description
│   ├───FETCH_HEAD
│   ├───HEAD
│   ├───index
│   └───ORIG_HEAD
├───brief_files\
│   ├───architecture.md
│   ├───epics.md
│   ├───ux-design-specification.md
│   ├───code-review\
│   │   ├───checklist.md
│   │   ├───instructions.xml
│   │   └───workflow.yaml
│   ├───stories\
│   │   ├───1-1-user-login-with-phone-number-national-code-and-password.md
│   │   ├───1-2-enforce-mandatory-2fa-for-staff.md
│   │   ├───1-3-user-profile-and-2fa-management.md
│   │   ├───1-4-admin-led-user-provisioning.md
│   │   ├───1-5-doctor-led-user-provisioning.md
│   │   ├───1-6-clerk-led-patient-provisioning.md
│   │   ├───1-7-secure-audit-logging.md
│   │   └───sprint-status.yaml
│   └───ui-refs\
│       ├───1-2-enforce-mandatory-2fa-for-staff-ui\
│       │   ├───1-2-enforce-mandatory-2fa-for-staff-ui.html
│       │   └───1-2-enforce-mandatory-2fa-for-staff-ui.png
│       ├───1-3-user-profile-and-2fa-management-ui\
│       │   ├───1-3-user-profile-and-2fa-management-ui.html
│       │   └───1-3-user-profile-and-2fa-management-ui.png
│       ├───1-4-admin-led-user-provisioning-ui\
│       │   ├───1-4-admin-led-user-provisioning-ui.html
│       │   └───1-4-admin-led-user-provisioning-ui.png
│       ├───1-5-doctor-led-user-provisioning-ui\
│       │   ├───1-5-doctor-led-user-provisioning-ui.html
│       │   └───1-5-doctor-led-user-provisioning-ui.png
│       ├───clerks-dashboard\
│       │   ├───clerks-dashboard.html
│       │   └───clerks-dashboard.png
│       ├───clerks-patient-page\
│       │   ├───clerks-patient-page.html
│       │   └───clerks-patient-page.png
│       ├───doctor-dashboard-draft\
│       │   ├───code.html
│       │   └───screen.png
│       ├───doctors-clinical-workspace\
│       │   ├───doctors-clinical-workspace.html
│       │   └───doctors-clinical-workspace.png
│       ├───login-page\
│       │   ├───login-page.html
│       │   └───login-page.png
│       └───patient-portal-visits-list\
│           ├───code.html
│           └───screen.png
├───docs\
├───drizzle\
│   ├───0000_open_maria_hill.sql
│   ├───0001_simple_phil_sheldon.sql
│   ├───0002_right_felicia_hardy.sql
│   └───meta\
│       ├───_journal.json
│       ├───0000_snapshot.json
│       ├───0001_snapshot.json
│       └───0002_snapshot.json
├───public\
│   ├───file.svg
│   ├───globe.svg
│   ├───next.svg
│   ├───vercel.svg
│   └───window.svg
└───src\
    ├───middleware.ts
    ├───app\
    │   ├───favicon.ico
    │   ├───globals.css
    │   ├───layout.tsx
    │   ├───page.tsx
    │   ├───_trpc\
    │   │   ├───client.ts
    │   │   └───provider.tsx
    │   ├───(admin)\
    │   │   ├───layout.tsx
    │   │   └───admin\
    │   │       ├───profile\
    │   │       │   └───page.tsx
    │   │       └───users\
    │   │           ├───page.tsx
    │   │           └───user-management-view.tsx
    │   ├───(auth)\
    │   │   ├───forgot-password\
    │   │   │   └───page.tsx
    │   │   ├───login\
    │   │   │   ├───login-form.tsx
    │   │   │   └───page.tsx
    │   │   └───setup-2fa\
    │   │       ├───page.tsx
    │   │       └───setup-form.tsx
    │   ├───(clerk)\
    │   │   ├───layout.tsx
    │   │   └───clerks\
    │   │       └───profile\
    │   │           └───page.tsx
    │   ├───(doctor)\
    │   │   ├───layout.tsx
    │   │   └───doctors\
    │   │       └───profile\
    │   │           └───page.tsx
    │   ├───(panel)\
    │   │   ├───layout.tsx
    │   │   ├───dashboard\
    │   │   │   └───page.tsx
    │   │   └───profile\
    │   │       └───page.tsx
    │   ├───(portal)\
    │   │   └───layout.tsx
    │   ├───api\
    │   │   ├───auth\
    │   │   │   └───[...nextauth]\
    │   │   │       └───route.ts
    │   │   └───trpc\
    │   │       └───[trpc]\
    │   │           └───route.ts
    │   ├───fonts\
    │   │   ├───Inter-Variable.woff2
    │   │   ├───material-symbols.css
    │   │   ├───MaterialSymbolsOutlined.woff2
    │   │   └───Vazirmatn-Variable.woff2
    │   └───protected\
    ├───components\
    │   ├───auth\
    │   │   └───logout-button.tsx
    │   ├───features\
    │   │   └───profile\
    │   │       ├───profile-schema.ts
    │   │       └───profile-view.tsx
    │   ├───layout\
    │   │   ├───admin-sidebar.tsx
    │   │   ├───clerk-sidebar.tsx
    │   │   ├───dashboard-layout.tsx
    │   │   ├───doctor-sidebar.tsx
    │   │   ├───header.tsx
    │   │   ├───portal-sidebar.tsx
    │   │   └───sidebar.tsx
    │   ├───providers\
    │   │   └───session-provider.tsx
    │   └───ui\
    │       ├───button.tsx
    │       ├───card.tsx
    │       └───input.tsx
    ├───lib\
    │   ├───auth.config.ts
    │   ├───auth.ts
    │   ├───utils.ts
    │   └───db\
    │       ├───index.ts
    │       └───schema.ts
    ├───server\
    │   ├───context.ts
    │   ├───index.ts
    │   ├───trpc.ts
    │   └───routers\
    │       ├───admin.ts
    │       ├───profile.ts
    │       └───totp.ts
    ├───tests\
    └───types\
        └───next-auth.d.ts
