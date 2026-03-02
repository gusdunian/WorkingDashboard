# Architecture

## System overview

### Component/data-flow diagram (text)

```text
User Browser (GitHub Pages static app)
  ├─ Loads index.html + style.css + script.js
  ├─ Local state cache (localStorage)
  ├─ Render pipeline (cards, lists, modals, filters)
  ├─ Autosync scheduler (debounced push + focus refresh)
  └─ Supabase client SDK
       ├─ Auth: sign-in/sign-out/session
       └─ Postgres table: dashboard_state (1 row per user)
            fields used by app:
              - user_id
              - state (JSON)
              - updated_at (timestamp)
```

### End-to-end runtime flow

1. App boots from static assets hosted on GitHub Pages.
2. Local cache is hydrated and rendered (local-first paint).
3. Supabase session is resolved.
4. If authenticated, app reads cloud `updated_at`/`state` and reconciles with local cache.
5. Mutations update in-memory state, persist locally, mark local dirty, and schedule debounced autosync.
6. Focus events trigger local re-hydrate first, then cloud refresh-if-newer.

## Runtime boundaries and responsibilities

### Browser/static frontend (GitHub Pages)

Owns:
- Full UI rendering and interactions.
- Local persistence (`localStorage`) and migration-on-read.
- Autosync orchestration.
- Import/export file handling.
- Privacy mode obfuscation at render time.

Does **not** own:
- User authentication identity issuance.
- Durable server-side storage guarantees.
- Authorization policy enforcement (delegated to Supabase RLS).

### Supabase Auth + Postgres

Owns:
- User authentication sessions.
- Durable cloud state row (`dashboard_state`) per user.
- Last-write metadata via `updated_at`.
- Row-level access enforcement through RLS.

Does **not** own:
- UI behavior/state derivation.
- Business logic migrations (performed client-side before write/read use).

## Deployment model

- **Source control**: `main` branch is deployable branch.
- **GitHub Pages pipeline**: `.github/workflows/pages.yml` deploys on push to `main`.
- **Pages source mode**: GitHub Actions artifact deployment.
- **Development flow**:
  - Work in feature branch.
  - Merge to `main` for production Pages publish.

## UI architecture (module-level)

### Render pipeline

1. `loadData()` reads local storage keys and normalizes entities.
2. `syncAppStateFromMemory()` copies list/module state into canonical `appState` snapshot.
3. `renderAll()` executes deterministic render order:
   - heading/theme/filter controls
   - action lists
   - big-ticket list
   - meeting notes groups
   - general notes groups
   - card layout/collapse state
4. UI state changes persist via `saveUiState()` and trigger re-render.

### State containers

- **Canonical state**: `appState` (migrated snapshot contract).
- **Working module state**:
  - `lists.general`, `lists.personal`, `lists.scheduling`
  - `meeting`
  - `bigTicket`
  - `generalNotes`
  - `uiState`
- **Sync control state**:
  - `cloud` object (auth/session/loading/sync metadata)
  - `localDirtySince`, `lastCloudUpdatedAt`, `lastSyncedAt`

### Interaction modules

- Card and list rendering with priority bucketing.
- Rich text editors with toolbar command execution.
- Modal stack for action edit, meeting edit, big-ticket edit, note edit, settings, import.
- Whiteboard canvas subsystem for general notes.
- Filter subsystem shared across cards.

## Autosync model (local-first + cloud refresh)

### Local-first

- Every successful mutation writes local storage immediately.
- Dirty marker (`localDirtySince`) is set on mutating saves.
- UI updates occur from local state instantly (no network roundtrip dependency).

### Debounced autosync push

- Trigger: mutation save path unless suppressed or blocked conditions apply.
- Debounce window: `AUTOSYNC_DEBOUNCE_MS` (2s).
- Loop behavior: while pending, push until queue drained.
- Blocked when:
  - privacy mode enabled,
  - import in progress,
  - unauthenticated,
  - autosync already in flight.

### Focus refresh

- On window focus:
  1. Re-hydrate and render local cache immediately.
  2. After `FOCUS_SYNC_DEBOUNCE_MS` (700ms), fetch cloud `updated_at`.
  3. Pull full cloud state only if cloud timestamp is newer than last known.

### Conflict behavior

- Before push, app reads cloud `updated_at`.
- If cloud is newer than local-known value:
  - push is aborted,
  - cloud state is pulled,
  - warning/info toast shown,
  - local data is replaced by newest cloud snapshot to prevent overwrite.
- Result: **cloud wins on detected staleness**; no field-level merge during normal autosync.

## Multi-device sync algorithm (authoritative)

1. Device A mutates locally and schedules autosync.
2. Device B mutates and syncs first; cloud `updated_at` advances.
3. Device A autosync executes preflight `updated_at` fetch.
4. If fetched `updated_at` > Device A `lastCloudUpdatedAt`, Device A treats cloud as authoritative.
5. Device A pulls cloud snapshot and does not write stale local state.
6. `lastCloudUpdatedAt` and `lastSyncedAt` are updated post-pull/push.

**Operational consequence**: this is timestamp-guarded last-writer avoidance (not CRDT). Cross-device concurrent edits may replace unsynced local changes when staleness is detected.

## Import/export pipeline and atomicity

### Export

- Export source order:
  1. Cloud row state if available.
  2. Local state fallback.
- Output JSON wrapper:
  - `exportedAt`
  - `stateVersion`
  - `state`

### Import

1. Parse JSON and validate wrapper shape (`state` object required).
2. Run `migrateState` on imported payload.
3. Apply mode:
   - `overwrite`: replace full local state after explicit confirmation.
   - `merge`: merge entities (by number/id rules) then migrate.
4. Recompute `nextActionNumber`.
5. Persist local state first (`setLocalDashboardState`).
6. Attempt cloud push.
7. If cloud push conflicts/fails, keep imported state local and surface warning.

### Atomicity model

- **Local atomicity**: import application to local cache is single-state replacement from migrated final state.
- **Cloud atomicity**: single upsert write; not transactional with local write.
- **Failure mode**: local success + cloud sync deferred is possible and expected; user must retry sync.

## EXTREMELY DETAILED UI SPEC (reusable)

### 1) Banner layout and session controls

- Header is sticky at viewport top.
- Left side:
  - Title uses configurable `ui.dashboardTitle`; falls back to default title if empty.
  - Date format is `Weekday Day<ordinal> Month Year` (example: `Monday 1st January 2026`).
  - Document `<title>` mirrors dashboard title.
- Favicon:
  - Browser uses `favicon.svg` from root.
  - Must remain static across themes; theme changes do not alter favicon asset.
- Right side (cloud controls):
  - Signed-out: email + password fields visible, `Sign in` visible.
  - Signed-in: compact signed-in display visible; credentials hidden.
  - Button order in signed-in control row: **Sign out, Export, Import, Settings**.
- Secondary status row order:
  1. Privacy toggle
  2. Hide/Expand all cards button
  3. Sync status bar
- Sync status bar is the **single source of truth** for state (`Ready`, loading, warning, error, synced timestamp). No detached bottom-right persistent sync indicator.

### 2) Settings modal

- Trigger: `Settings` button (signed-in only).
- Theme presets include office-style options; selecting preset populates color inputs.
- Theme scope is strict to:
  - banner background/text,
  - page background,
  - card header background/text.
- No theme bleed into semantic status colors (warning/error/success) or data-dependent color coding.
- Custom overrides:
  - Any manual color input change forces preset selector to `Custom`.
- Dashboard title editing:
  - Input max length 120.
  - Blank/whitespace save resolves to default title.
- Save behavior:
  - Commits `ui.theme` and `ui.dashboardTitle`.
  - Persists through `saveUiState()` and survives reload/sync.
- Cancel/close behavior:
  - Reverts previewed (unsaved) theme values.
  - Leaves persisted state unchanged.

### 3) Global controls and filters

- Hide/Expand all:
  - If all cards collapsed, button shows `Expand`; else `Hide`.
  - Toggling updates every card collapse flag and persists.
- Global filters (person/tag):
  - Available in action toolbars and mirrored across relevant cards.
  - Selection stored once in `ui.personFilter` + `ui.tagFilter` and applied globally.
- Tag parsing rules:
  - People tags: `@Token` using regex boundary `(^|[\s(>])(@[A-Za-z0-9_-]+)`.
  - Hash tags: `#Token` using regex boundary `(^|[\s(>])(#[A-Za-z0-9_-]+)`.
  - Matching is case-insensitive for filtering; original token case retained for display.
  - Extraction uses plain text projection from rich HTML, so newline/paragraph/list boundaries are safe.

### 4) Card system

- Card header strip includes:
  - icon + title,
  - reorder control cluster (← → ↑ ↓),
  - chevron collapse toggle.
- Collapse behavior:
  - Collapsed card body is `hidden`; no placeholder whitespace retained.
- Layout persistence:
  - `ui.cardLayout.columns` stores card order/column placement.
  - Left/right move changes column, prepending in destination.
  - Up/down move reorders within current column.
  - On small screens, left/right controls are disabled.

### 5) Editors and rich text

- Rich controls available: Bold, Italic, Underline, Bulleted list, Numbered list.
- Keyboard shortcuts:
  - Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U.
  - Ctrl/Cmd+Shift+8 (bullets), Ctrl/Cmd+Shift+7 (numbered).
- Tab/Shift+Tab list behavior:
  - Must preserve browser-native list indent/outdent behavior for contenteditable list items.
  - Do not introduce custom handlers that break nested list semantics.
- Storage forms:
  - canonical rich HTML (`html` or `notesHtml`),
  - derived inline HTML (`html_inline`) for row rendering,
  - derived plain text (`text`/`notesText`) for filtering/validation/privacy rendering.

### 6) Modals

- Standard modal defaults:
  - centered dialog,
  - modal backdrop active,
  - close button top-right,
  - footer actions right-aligned.
- Resizing:
  - large edit modals are vertically scrollable and use wide dialog classes where configured.
- Footer button order convention:
  - Secondary actions (Dictate/Cancel) before primary Save/Import.
- Background blur:
  - Backdrop should visually suppress content region only; avoid blurring sticky banner/status controls where possible.
- Dictate behavior:
  - Button toggles `Dictate` ↔ `Stop` while active recognition session runs.
  - Uses Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`).
  - Unsupported browsers surface non-fatal warning toast.

### 7) Action list behavior

- Priority states and labels:
  - `!!` = super urgent,
  - `!` = urgent,
  - `normal` = default,
  - `L` = low.
- Visual coloring:
  - Priority class applied on active rows (`pri-super`, `pri-urgent`, `pri-normal`, `pri-low`).
- Right-side controls only:
  - urgency cycle button,
  - timing/delegation toggle (`T` / `D` / off),
  - delete/undelete (`X` / `UD`).
- Ordering rules within list:
  1. active super urgent,
  2. active urgent,
  3. active normal,
  4. active low,
  5. completed,
  6. deleted.
- Within each active bucket, timing `T` items float above non-`T` items, then newest-first.
- Highlight rules:
  - add/move/state-cycle operations queue temporary highlight class.
  - highlight expires after fixed timeout and self-clears.
- Text rendering:
  - rows show one-line inline projection.
  - overflow shows `+` control (`more`) which opens full modal editor.

### 8) Meeting notes

- Grouping hierarchy:
  - Month group (descending),
  - Week group inside month (`W/C dd/mm`, descending),
  - Meeting items inside week (descending datetime).
- Collapsing:
  - Month and week collapse states persisted independently.
- Add flow:
  - Requires title, date, time (15-minute increments), and notes content.
  - Submission resets form and returns focus to title input.
- Recorded flag (`R`):
  - Convention: include `(R)` in title to mark recorded meeting; preserve in title text exactly.
- `%123%` action injection behavior:
  - Convention for reusable integrations: `%<actionNumber>%` token may be parsed by higher-level tooling to reference action items.
  - Current app stores token text verbatim; no automatic action mutation is performed.

### 9) General notes

- Grouping:
  - Group by month (`YYYY-MM`) descending.
  - Month collapse persisted in `ui.collapsedGeneralNotesMonths`.
- Editing modes:
  - Text editor tab and Whiteboard tab in big-edit modal.
- Whiteboard persistence model:
  - Stores raster snapshot as `whiteboardDataUrl` (`data:image/...`) plus optional `whiteboardMeta`.
  - Save on explicit note save if canvas touched/has content.
- Whiteboard toolset:
  - Pen, Eraser, Line, Rectangle, Circle, Text.
  - Adjustable color and stroke width.
  - Undo and Clear operations.

## Architectural invariants

- `migrateState` is applied before meaningful state use/write.
- UI filters are globally shared, not per-card independent.
- Cloud sync never runs in privacy mode.
- Layout/collapse/theme/title belong to `ui` persisted state.
- Import/export always pass through migration and schema normalization.
