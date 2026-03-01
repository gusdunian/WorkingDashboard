# Documentation Index

This `/docs` directory is the operational source of truth for the Working Dashboard system.
It documents architecture, runtime behavior, data contracts, security controls, and team practices.
Use this index to route quickly to the right document for design, implementation, support, and operations.

## What this app is

Working Dashboard is a single-user, static web application that runs in the browser and syncs to Supabase.  
It provides action tracking, meeting notes, big-ticket planning, and general notes with rich text editing.  
The UI is local-first and then cloud-synced to support low-latency interaction across devices.  
Authentication is Supabase Auth; persistent server state is stored in one `dashboard_state` row per user.  
Deployment is GitHub Pages with a GitHub Actions workflow from `main`.

## Navigation

- [`architecture.md`](./architecture.md) — Use for system design, module responsibilities, sync behavior, and reusable UI architecture spec.
- [`data-model.md`](./data-model.md) — Use for canonical `dashboard_state.state` schema, field contracts, migrations, import/export format, and rich-text rules.
- [`security.md`](./security.md) — Use for threat model, RLS expectations, secrets policy, privacy mode, and logging constraints.
- [`operations.md`](./operations.md) — Use for deployment operations, promotion workflow, backup/recovery, incidents, and repo rename procedure.
- [`development.md`](./development.md) — Use for branch/PR/testing agreements, code structure conventions, feature implementation patterns, performance, accessibility, and UI component spec.
- [`troubleshooting.md`](./troubleshooting.md) — Use for symptom-to-cause-to-fix guides and exact verification steps.
- [`changelog.md`](./changelog.md) — Use for release notes and state-version-related change tracking.

## Document maintenance conventions

- **Ownership**: Engineering team owns all files in `/docs`; reviewers are expected to treat docs as code.
- **PR rule**: Any PR that changes behavior, UX, schema, sync logic, auth behavior, imports/exports, or operational workflow must update affected docs in the same PR.
- **Version discipline**:
  - Data model changes must update `data-model.md` and `changelog.md`.
  - UI behavior changes must update both UI spec sections in `architecture.md` and `development.md`.
  - Security-affecting changes must update `security.md`.
- **Accuracy standard**: Keep docs current-state oriented. Remove superseded guidance instead of stacking historical notes.
- **No sensitive content**: Never include secrets, tokens, private endpoints, or user data examples.
