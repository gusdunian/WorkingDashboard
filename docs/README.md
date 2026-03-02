# Documentation Index

This `/docs` folder is the current-state reference for Working Dashboard.
Use it for architecture, runtime behaviour, data contracts, operations, and active development practices.

## What is covered

Working Dashboard is a browser app hosted on GitHub Pages, with Supabase Auth + Postgres persistence.
The app renders local state first, then performs background cloud refresh/sync so the UI stays responsive while still converging across devices.

These docs cover:
- GitHub Pages deployment and branch promotion workflow.
- Supabase-backed auth/sync/runtime guardrails.
- Canonical `dashboard_state` schema and migrations.
- UI shell, filters, privacy mode, whiteboard, card layout controls, import/export, and autosave behaviour.
- Development patterns and incident runbooks.

## Navigation

- [`architecture.md`](./architecture.md) — Runtime architecture, sync flow, UI shell contract, modal behaviour, and card layout mechanics.
- [`data-model.md`](./data-model.md) — Canonical state schema (`stateVersion`, `migrateState`, entities, and UI fields).
- [`security.md`](./security.md) — Security constraints, privacy mode limits, and secret-handling rules.
- [`operations.md`](./operations.md) — Deployment/promotion workflow, merge conflict runbooks, import/recovery, and cache guidance.
- [`development.md`](./development.md) — Engineering implementation patterns (idempotent init, delegation, autosave, parser rules, whiteboard scope).
- [`troubleshooting.md`](./troubleshooting.md) — Symptom → diagnosis → fix guides for runtime and sync issues.
- [`changelog.md`](./changelog.md) — Dated user-visible changes and state/model updates.

## Branch and deployment workflow

- Day-to-day integration branch is `dev`.
- Production branch is `main`.
- Promotion path is **`dev` → `main`** via PR, then GitHub Actions deploys Pages from `main`.
- If repository Pages settings are temporarily switched to a branch source (instead of Actions), switch back to the standard production source after verification to avoid drift from the documented release flow.

## Maintenance rules

- Update docs in the same PR as behaviour changes.
- Keep language implementation-oriented; remove stale guidance instead of stacking historical notes.
- Never include secrets, API keys, private URLs, or user data.
