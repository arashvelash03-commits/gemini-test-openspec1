```
📦 
├─ .db_url_for_migrate
├─ .gitignore
├─ AGENTS.md
├─ INSTRUCTIONS.txt
├─ OFFLINE_GUIDE.md
├─ README.md
├─ README_UPDATE.txt
├─ TAILWIND_OFFLINE.md
├─ _bmad-output
│  └─ planning-artifacts
│     ├─ architecture.md
│     ├─ prd.md
│     └─ ux-design-specification.md
├─ brief_files
│  ├─ architecture.md
│  ├─ code-review
│  │  ├─ checklist.md
│  │  ├─ instructions.xml
│  │  └─ workflow.yaml
│  ├─ epics.md
│  ├─ stories
│  │  ├─ 1-1-user-login-with-phone-number-national-code-and-password.md
│  │  ├─ 1-2-enforce-mandatory-2fa-for-staff.md
│  │  ├─ 1-3-user-profile-and-2fa-management.md
│  │  ├─ 1-4-admin-led-user-provisioning.md
│  │  ├─ 1-5-doctor-led-user-provisioning.md
│  │  ├─ 1-6-clerk-led-patient-provisioning.md
│  │  ├─ 1-7-secure-audit-logging.md
│  │  └─ sprint-status.yaml
│  ├─ ui-refs
│  │  ├─ 1-2-enforce-mandatory-2fa-for-staff-ui
│  │  │  ├─ 1-2-enforce-mandatory-2fa-for-staff-ui.html
│  │  │  └─ 1-2-enforce-mandatory-2fa-for-staff-ui.png
│  │  ├─ 1-3-user-profile-and-2fa-management-ui
│  │  │  ├─ 1-3-user-profile-and-2fa-management-ui.html
│  │  │  └─ 1-3-user-profile-and-2fa-management-ui.png
│  │  ├─ 1-4-admin-led-user-provisioning-ui
│  │  │  ├─ 1-4-admin-led-user-provisioning-ui.html
│  │  │  └─ 1-4-admin-led-user-provisioning-ui.png
│  │  ├─ 1-5-doctor-led-user-provisioning-ui
│  │  │  ├─ 1-5-doctor-led-user-provisioning-ui.html
│  │  │  └─ 1-5-doctor-led-user-provisioning-ui.png
│  │  ├─ clerks-dashboard
│  │  │  ├─ clerks-dashboard.html
│  │  │  └─ clerks-dashboard.png
│  │  ├─ clerks-patient-page
│  │  │  ├─ clerks-patient-page.html
│  │  │  └─ clerks-patient-page.png
│  │  ├─ doctor-dashboard-draft
│  │  │  ├─ code.html
│  │  │  └─ screen.png
│  │  ├─ doctors-clinical-workspace
│  │  │  ├─ doctors-clinical-workspace.html
│  │  │  └─ doctors-clinical-workspace.png
│  │  ├─ login-page
│  │  │  ├─ login-page.html
│  │  │  └─ login-page.png
│  │  └─ patient-portal-visits-list
│  │     ├─ code.html
│  │     └─ screen.png
│  └─ ux-design-specification.md
├─ docker-compose.yml
├─ drizzle.config.ts
├─ drizzle
│  ├─ 0000_open_maria_hill.sql
│  ├─ 0001_simple_phil_sheldon.sql
│  ├─ 0002_right_felicia_hardy.sql
│  └─ meta
│     ├─ 0000_snapshot.json
│     ├─ 0001_snapshot.json
│     ├─ 0002_snapshot.json
│     └─ _journal.json
├─ eslint.config.mjs
├─ next.config.ts
├─ openspec
│  ├─ changes
│  │  └─ user-login-with-phone-number-national-code-and-password
│  │     ├─ .openspec.yaml
│  │     ├─ design.md
│  │     ├─ proposal.md
│  │     ├─ specs
│  │     │  └─ user-authentication
│  │     │     └─ spec.md
│  │     └─ tasks.md
│  └─ config.yaml
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ scripts
│  ├─ debug-db.js
│  ├─ seed.ts
│  └─ test-login.js
├─ src
│  ├─ app
│  │  ├─ (admin)
│  │  │  ├─ admin
│  │  │  │  ├─ profile
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ users
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ user-management-view.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (auth)
│  │  │  ├─ forgot-password
│  │  │  │  └─ page.tsx
│  │  │  ├─ login
│  │  │  │  ├─ login-form.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ setup-2fa
│  │  │     ├─ page.tsx
│  │  │     └─ setup-form.tsx
│  │  ├─ (clerk)
│  │  │  ├─ clerks
│  │  │  │  └─ profile
│  │  │  │     └─ page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (doctor)
│  │  │  ├─ doctors
│  │  │  │  └─ profile
│  │  │  │     └─ page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (panel)
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ profile
│  │  │     └─ page.tsx
│  │  ├─ (portal)
│  │  │  └─ layout.tsx
│  │  ├─ _trpc
│  │  │  ├─ client.ts
│  │  │  └─ provider.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  └─ trpc
│  │  │     └─ [trpc]
│  │  │        └─ route.ts
│  │  ├─ favicon.ico
│  │  ├─ fonts
│  │  │  ├─ MaterialSymbolsOutlined.woff2
│  │  │  ├─ Vazirmatn-Variable.woff2
│  │  │  └─ material-symbols.css
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ auth
│  │  │  └─ logout-button.tsx
│  │  ├─ features
│  │  │  └─ profile
│  │  │     ├─ profile-schema.ts
│  │  │     └─ profile-view.tsx
│  │  ├─ layout
│  │  │  ├─ admin-sidebar.tsx
│  │  │  ├─ clerk-sidebar.tsx
│  │  │  ├─ dashboard-layout.tsx
│  │  │  ├─ doctor-sidebar.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ portal-sidebar.tsx
│  │  │  └─ sidebar.tsx
│  │  ├─ providers
│  │  │  └─ session-provider.tsx
│  │  └─ ui
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     └─ input.tsx
│  ├─ lib
│  │  ├─ auth.config.ts
│  │  ├─ auth.ts
│  │  ├─ db
│  │  │  ├─ index.ts
│  │  │  └─ schema.ts
│  │  └─ utils.ts
│  ├─ middleware.ts
│  ├─ server
│  │  ├─ context.ts
│  │  ├─ index.ts
│  │  ├─ routers
│  │  │  ├─ admin.ts
│  │  │  ├─ profile.ts
│  │  │  └─ totp.ts
│  │  └─ trpc.ts
│  └─ types
│     └─ next-auth.d.ts
└─ tsconfig.json
```