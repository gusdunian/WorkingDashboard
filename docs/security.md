# Security

## Security posture summary

This application is a browser-executed, single-user dashboard backed by Supabase Auth and Postgres.
The browser is treated as an untrusted runtime for secrets but trusted for user-initiated state editing.
Server-side authorization must rely on Supabase Row Level Security (RLS), not on hidden client logic.

## Threat model (single-user app)

### Assets

- Dashboard state JSON (tasks, notes, meeting data, UI preferences).
- User account/session.
- Backup files exported to local device.

### Trust boundaries

- Public static hosting boundary (GitHub Pages).
- Browser runtime boundary (user device, extensions, shared computer risk).
- Supabase auth/storage boundary.

### Primary threats

- Unauthorized row access due to weak/missing RLS.
- Session misuse on shared devices.
- Sensitive text exposure via screen sharing/logging/screenshot.
- Malicious/invalid import file content.
- XSS vectors in rich text if sanitization is bypassed.

### Out of scope

- Multi-tenant complex role model.
- Server-side background processing compromise (none exists in repo).

## Supabase RLS expectations

## Why publishable/anon keys are acceptable only with RLS

The client uses a Supabase publishable/anon key by design. This key identifies project access but does not grant unrestricted data access when RLS is correctly configured.

## Required table policy model (`dashboard_state`)

- One row per authenticated user (`user_id`).
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies scoped to `auth.uid() = user_id`.
- No broad anonymous read/write policy.

## Required operational checks

- RLS enabled on `dashboard_state`.
- Policies tested with two different users to verify isolation.
- Service-role keys never embedded in frontend code.

## Secrets handling rules

- Never place API secrets, service-role tokens, SMTP credentials, or private endpoints in client-side files.
- Only publishable client credentials are allowed in browser code.
- Environment-specific sensitive values must be managed outside this repository.
- Do not commit user-generated backup payloads or screenshots containing private content.

## Privacy Mode

## Rules

- Privacy Mode is a **render-only obfuscation mode**.
- It masks visible textual content with deterministic placeholder prose.
- While enabled:
  - mutation actions are blocked (`canMutateData` false path),
  - autosync writes are disabled,
  - filters return generic placeholder options.

## Limitations

- Existing data still exists in memory/local storage/cloud; privacy mode does not encrypt or redact persisted storage.
- Browser devtools or direct storage access can still expose underlying data.
- Screenshots are safer but still may expose structural metadata (counts, timestamps, labels).
- Whiteboard imagery is not transformed at storage level.

## Data minimization and retention guidance

- Keep only operationally required content in notes/actions.
- Avoid storing regulated sensitive data unless policy explicitly permits it.
- Export backups only when needed; keep retention period short and controlled.
- Delete outdated local backup files from endpoints and shared folders.
- Prefer soft-delete/archive workflows over uncontrolled duplication.

## Logging and telemetry rules

- Do not log raw note/action content to console or external telemetry.
- Status messages should remain generic and avoid embedding user content.
- Error handling must not include secrets or full payload dumps.
- Auth/sync logs should include event type and generic error reason only.

## Import/export security controls

- Import accepts only JSON wrapper with `state` object and migration normalization.
- Sanitization and schema normalization apply before imported content becomes active.
- Overwrite mode requires explicit confirmation.
- Treat imported files as untrusted input.

## Security checklist for changes

Before merging changes affecting auth/storage/rich-text/import:
- [ ] RLS assumptions unchanged or updated with migration instructions.
- [ ] No secrets introduced in code/docs.
- [ ] Rich text still routed through sanitizer.
- [ ] Privacy mode still blocks mutation and autosync.
- [ ] Error/status messages do not leak private text.
