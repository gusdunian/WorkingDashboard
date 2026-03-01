# Operations

## Deployment and runtime operations

## GitHub Pages deployment settings

- Use GitHub Pages with **Source = GitHub Actions**.
- Deployment workflow: `.github/workflows/pages.yml`.
- Trigger: push to `main`.
- Artifact path: repository root (`path: .`).

## Branch deployment approach

- `dev` (or feature branches) are non-production validation branches.
- `main` is production publish branch for Pages.
- Promote by PR merge from feature/dev branch into `main`.

## Dev → main promotion checklist

1. Confirm functional changes tested locally (desktop/mobile).
2. Confirm multi-device sync behavior validated (at least two browser sessions).
3. Confirm docs updated (`/docs` as needed).
4. Confirm no secrets/private URLs introduced.
5. Merge to `main`.
6. Verify workflow run success in GitHub Actions.
7. Verify GitHub Pages URL loads updated build.

## Backup and recovery

## Recommended backup cadence

- Minimum: weekly export for active users.
- Additional: immediate export before schema-impacting upgrades/import-overwrite operations.
- Keep timestamped backups in secure local storage.

## Restore via import

- **Merge** restore:
  - Use when appending/reconciling partial backups.
  - Preserves most existing local UI settings and merges entities by number/id.
- **Overwrite** restore:
  - Use for full rollback to backup snapshot.
  - Requires explicit confirmation dialog.

## Post-restore verification

1. Verify dashboard loads all expected cards and data.
2. Verify `nextActionNumber` continued correctly (new action gets expected next number).
3. Verify sync status reaches synced state.
4. Trigger manual export to confirm recovered state serializes correctly.

## Supabase table checks (`dashboard_state`)

Perform these checks when diagnosing cloud persistence:
- Row exists for authenticated `user_id`.
- `state` column is valid JSON object with expected top-level keys.
- `updated_at` advances after successful sync.
- RLS policies restrict row to owner.

## Incident playbooks

## 1) Sync conflicts / blank-on-focus

Symptoms:
- Data appears to revert or refresh after tab focus.
- Warning toast indicates cloud updated elsewhere.

Actions:
1. Confirm whether another device/session edited recently.
2. Export current local state immediately.
3. Allow focus refresh pull to complete.
4. If needed, import exported backup via merge.
5. Re-validate `updated_at` progression.

## 2) Auth redirect/session failures

Symptoms:
- `Auth state failed` status.
- Sign-in appears successful but app remains signed out.

Actions:
1. Verify Supabase Auth allowed redirect origins include current Pages URL.
2. Confirm browser allows storage/cookies for the site.
3. Sign out/in and inspect status messages.
4. Check Supabase project auth logs for rejected sessions.

## 3) Import validation failures

Symptoms:
- `Import failed: invalid backup format.`

Actions:
1. Confirm JSON is parseable.
2. Confirm payload has wrapper with `state` object.
3. Confirm no manual edits corrupted structure.
4. Retry with known-good export file.

## Repo rename procedure (safe)

When renaming repository:

1. Update GitHub Pages expected URL and verify deployment target path.
2. Update Supabase Auth redirect allowlist to include new Pages URL.
3. Validate sign-in session callback using new URL.
4. Validate backup import/export still works under renamed site path.
5. Purge stale favicon and static asset cache in browser when validating rename.

## Routine operations runbook

Daily/regular:
- Review sync status behavior after edits.
- Ensure no persistent warning/error toasts.

Weekly:
- Perform backup export.
- Verify Pages deployment health on last merged change.

Before release:
- Run complete promotion checklist.
- Confirm docs/changelog updates.
