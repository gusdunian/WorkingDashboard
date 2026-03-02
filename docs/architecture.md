# Architecture

## 1) System overview

Working Dashboard is a static frontend served by GitHub Pages and backed by Supabase (`auth` + `dashboard_state` row per user).

### Runtime model

1. App loads static assets.
2. Local cache is migrated and rendered immediately (local-first paint).
3. Auth session is resolved.
4. If signed in, cloud metadata/state is checked in the background.
5. If cloud `updated_at` is newer than locally known cloud state, local state is replaced by cloud state.
6. Local edits mark state dirty, save locally, and schedule debounced autosync.

### Cloud refresh and overwrite guardrails

- Refresh path uses `updated_at` checks before replacing local state.
- Push path also checks cloud `updated_at` first.
- If cloud is newer, push is aborted and latest cloud state is pulled.
- This prevents stale-device overwrite in multi-device usage (cloud wins when conflict is detected).

## 2) Sync and status philosophy

### Autosync

- Mutations call local persistence first, then queue autosync.
- Autosync is debounced and serialized to avoid concurrent writes.
- Focus return triggers local rehydrate first, then delayed cloud refresh-if-newer.
- Import operations set an import lock (`importInProgress`) so autosync/refresh paths do not race import writes.

### Status messaging

- The authoritative status surface is the single top/header status area.
- Transient toasts may still appear for short-lived notifications, but there is no separate persistent bottom-right status widget.
- Errors and sync states should not be duplicated across multiple always-on locations.

## 3) UI shell specification

## Banner/header

Banner contains:
- Dashboard title (settings-controlled).
- Current date.
- Auth controls:
  - signed-out: email/password + sign-in.
  - signed-in: signed-in identity chip + Sign out / Export / Import / Settings.
- Privacy toggle button.
- Hide/Expand all control.
- Top sync/status text.

### Global filters

- Located in the banner area under the date.
- Filters are global state (`personFilter`, `tagFilter`, `searchQuery`), not per-card state.
- Filter scope includes action lists, meeting notes, and general notes where token extraction is supported.

## 4) Modal behaviour

### Blur/background treatment

- Opening big-edit experiences blurs/obscures card content regions.
- Header/navigation context remains legible and should not be blurred like body content.

### Edit Meeting autosave (draft-safe)

- Meeting big edit tracks dirty state and performs debounced autosave.
- Autosave updates meeting title/date/time/notes/recorded fields when minimum valid draft requirements are met.
- Close attempts with unsaved changes trigger confirmation and then force autosave before close.
- Empty draft stubs are cleaned up when closed.

## 5) Card layout and movement

### Persisted layout

- Card ordering and column placement are persisted in `ui.cardLayout`.
- Layout is normalized during load/migration to ensure all known cards exist in exactly one column.

### Move controls

- Each card header includes L/R/U/D controls.
- Left/right moves across columns.
- Up/down reorders within a column.
- Controls are disabled/hidden when move is not valid (including responsive constraints).

### Robustness requirements

- Card move control initialization must be idempotent.
- Dynamic controls are handled via event delegation to avoid duplicate listeners and stale-node references.
- Reorder logic must avoid direct DOM assumptions that can produce `insertBefore` `NotFoundError` after rerender/reparent operations.

## 6) Feature architecture notes

### Privacy mode

- Privacy mode obfuscates visible content and suppresses data mutation paths.
- It is a display/runtime mode, not a storage encryption layer.

### Whiteboard in General Notes

- General note editor supports text + whiteboard modes.
- Whiteboard state persists as image snapshot (`whiteboardDataUrl`) plus optional structured image overlay list.

### Import modes

- Import supports `overwrite` and `merge`.
- Merge deduplicates by stable identity (action number/id depending on entity).
- Overwrite replaces full local snapshot (after explicit user confirmation).

## 7) Cross references

- Data contracts: [`data-model.md`](./data-model.md)
- Runbooks and incident response: [`operations.md`](./operations.md)
- Failure diagnosis details: [`troubleshooting.md`](./troubleshooting.md)
- Implementation patterns: [`development.md`](./development.md)
