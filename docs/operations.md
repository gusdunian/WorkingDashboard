# Operations

## 1) Deployment and promotion

- Integration branch: `dev`.
- Production branch: `main`.
- Standard release path:
  1. Merge feature branches into `dev`.
  2. Validate in `dev`.
  3. Open `dev` → `main` PR.
  4. Merge to `main` to trigger Pages deployment.

If Pages source mode is temporarily switched to a direct branch, restore the standard production source after release verification.

## 2) Runbook: dev → main merge conflicts

When conflicts occur during promotion PR:
1. Checkout `main` locally.
2. Merge `dev` into `main`.
3. For known generated/docs conflict patterns in this project, prefer **incoming (`dev`)** content unless there is a confirmed production-only hotfix to preserve.
4. Re-run smoke checks.
5. Commit conflict resolution and push.

Minimal commands:
- `git checkout main`
- `git pull`
- `git merge dev`
- resolve files (`--theirs` where appropriate), commit, push.

## 3) Runbook: “cloud updated elsewhere” loops

Symptoms:
- Repeated warning/toast about cloud being updated elsewhere.

Checks:
1. Confirm multiple active devices/sessions.
2. Verify local clock skew is not extreme.
3. Inspect `dashboard_state.updated_at` progression in Supabase.
4. Confirm local dirty writes are not continuously happening from a background mutation loop.

Recovery:
1. Export backup first.
2. Stop edits on secondary devices.
3. Reload primary tab; allow pull-from-cloud to complete.
4. Make one test edit; verify single successful sync.

## 4) Cache-busting guidance

Use in this order:
1. Hard refresh browser tab.
2. Clear service/static cache for the site origin.
3. Confirm latest `main` deployment completed successfully.
4. Re-open in an incognito/private window to verify asset freshness.

If users still see stale UI after deployment, compare loaded asset hashes/timestamps in devtools network panel.

## 5) Import reliability runbook

Guardrails implemented:
- Import acquires app-level import lock (`importInProgress`).
- While locked, autosync and refresh paths are suppressed to avoid races.

Operational steps:
1. Export backup before import.
2. Choose mode:
   - `overwrite`: replace everything after confirmation.
   - `merge`: merge by stable IDs/numbers.
3. Wait for import + sync completion status.
4. Verify critical entities in UI and cloud row.

If cloud sync conflicts during import, local import is retained and user is prompted to retry cloud sync.

## 6) Recovery workflow (backup + restore)

1. Export latest backup JSON.
2. Preserve problematic snapshot for audit.
3. Re-import known-good backup using overwrite mode.
4. Confirm sync success.
5. Validate row in Supabase (`dashboard_state.state`, `updated_at`).
6. Perform a small edit and verify subsequent autosync.

## 7) Routine operational checks

- Auth sign-in/out path works.
- Header status updates without persistent duplicate status widgets.
- Local-first boot works offline/slow-network.
- Focus-return cloud refresh works without overwrite conflicts.
- Import/export roundtrip remains valid JSON and migrates cleanly.
