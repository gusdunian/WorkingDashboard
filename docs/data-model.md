# Data Model

## Canonical persisted object

The canonical payload stored in `dashboard_state.state` is a JSON object with this top-level shape:

```json
{
  "stateVersion": 12,
  "generalActions": [],
  "personalActions": [],
  "schedulingActions": [],
  "bigTicketItems": [],
  "meetingNotes": [],
  "generalNotes": [],
  "ui": {
    "collapsedCards": {},
    "collapsedGeneralNotesMonths": {},
    "cardLayout": { "columns": [] },
    "theme": {
      "presetName": "Office Blue",
      "vars": {
        "bannerBg": "#...",
        "bannerFg": "#...",
        "pageBg": "#...",
        "cardHeaderBg": "#...",
        "cardHeaderFg": "#..."
      }
    },
    "dashboardTitle": "...",
    "personFilter": "All",
    "tagFilter": "All"
  },
  "meetingNotesUIState": {
    "collapsedMonths": {},
    "collapsedWeeks": {}
  },
  "nextActionNumber": 137
}
```

## Top-level fields

### `stateVersion` (number, required)

- Current constant: `LATEST_STATE_VERSION = 12`.
- Must be positive integer.
- Migrator upgrades lower versions to latest.

### `generalActions` (array<ActionItem>, required)

- Numbered actionable list.
- Supports completion/deletion/archive, urgency and timing metadata.

### `personalActions` (array<PersonalActionItem>, required)

- Unnumbered personal task list.
- Same action semantics except uses `id` instead of `number`.

### `schedulingActions` (array<ActionItem>, required)

- Numbered scheduling-focused task list.
- Shared schema and ordering semantics with `generalActions`.

### `bigTicketItems` (array<BigTicketItem>, required)

- Prioritized rich-text items for larger initiatives.

### `meetingNotes` (array<MeetingNote>, required)

- Meeting entries with title, datetime, and rich notes.

### `generalNotes` (array<GeneralNote>, required)

- Dated general notes with rich text and optional whiteboard snapshot.

### `ui` (object, required)

- Persisted presentation + navigation state.

### `meetingNotesUIState` (object, required)

- Persisted collapses for month/week meeting groups.

### `nextActionNumber` (number, required)

- Next integer assigned for new numbered action in general/scheduling lists.
- Recomputed when needed to remain > highest existing numbered action.

## Entity definitions (field-by-field)

## `ActionItem` (`generalActions`, `schedulingActions`)

- `number` (integer, required): stable action identifier.
- `text` (string, required derived): plain text projection of rich content.
- `html` (string, required): sanitized rich HTML.
- `html_inline` (string, required): sanitized inline-safe HTML projection.
- `createdAt` (number epoch ms, required).
- `updatedAt` (number epoch ms, required).
- `completed` (boolean, required).
- `deleted` (boolean, required).
- `archived` (boolean, required): hides from visible list but retained in state.
- `urgencyLevel` (integer, required): `0` normal, `1` urgent, `2` super urgent, `3` low.
- `timingFlag` (string|null, required): `"T"` (time-dependent), `"D"` (delegated), or `null`.
- `completedAt` (number|null, optional): set when marked completed.
- `deletedAt` (number|null, optional): set when marked deleted.

## `PersonalActionItem` (`personalActions`)

Same as `ActionItem`, except:
- `id` (string, required) replaces `number`.
- `idPrefix` convention is `pact-...`.

## `BigTicketItem`

- `id` (string, required).
- `text` (string, required derived).
- `html` (string, required).
- `html_inline` (string, required).
- `urgencyLevel` (integer, required): same scale as actions.
- `timingFlag` (string|null, required): `T`, `D`, or null.
- `createdAt` (number epoch ms, required).
- `updatedAt` (number epoch ms, required).
- `whiteboardDataUrl` (string|null, optional): `data:image/...` snapshot when present.
- `whiteboardMeta` (object|null, optional): canvas metadata (e.g., width/height/updatedAt).

## `MeetingNote`

- `id` (string, required).
- `title` (string, required).
- `datetime` (string ISO datetime, required).
- `notesHtml` (string, required): sanitized rich HTML.
- `notesText` (string, required derived): plain text projection.
- `createdAt` (string ISO datetime | null, optional).
- `updatedAt` (string ISO datetime | null, optional).

## `GeneralNote`

- `id` (string, required).
- `date` (string `YYYY-MM-DD`, required).
- `title` (string, required).
- `html` (string, required): sanitized rich HTML.
- `html_inline` (string, required).
- `text` (string, required derived).
- `createdAt` (number epoch ms, required).
- `updatedAt` (number epoch ms, required).
- `whiteboardDataUrl` (string|null, optional): must start with `data:image/` when present.
- `whiteboardMeta` (object|null, optional).

## `ui` object fields

- `collapsedCards` (object map, required):
  - keys: `generalActions`, `personalActions`, `bigTicket`, `scheduling`, `meetingNotes`, `generalNotes`.
  - values: boolean collapsed state.
- `collapsedGeneralNotesMonths` (object map, required): month key -> boolean.
- `cardLayout` (object, required):
  - `columns` (array of arrays of card IDs).
- `theme` (object, required):
  - `presetName` (string; one preset or `Custom`).
  - `vars` (object): `bannerBg`, `bannerFg`, `pageBg`, `cardHeaderBg`, `cardHeaderFg`.
- `dashboardTitle` (string, required).
- `personFilter` (string, required): selected global people filter or `All`.
- `tagFilter` (string, required): selected global tag filter or `All`.

## `meetingNotesUIState` fields

- `collapsedMonths` (object map): month key -> boolean.
- `collapsedWeeks` (object map): composite week key -> boolean.

## Soft-delete and archive semantics

- `completed=true`: action is completed; rendered in completed bucket.
- `deleted=true`: action is deleted (soft delete); rendered in deleted bucket.
- `archived=true`: action removed from visible ordering across all buckets, retained in data.
- `CC` clear-completed behavior:
  - completed/deleted rows are not hard-deleted.
  - they are marked/transitioned out of active display via archive logic; historical metadata stays available.

## State versioning and migrations

## Version constants

- `LATEST_STATE_VERSION` is authoritative latest schema version.
- Any persisted state with lower version must pass through `migrateState` before use.

## `migrateState` contract

Input:
- arbitrary object (possibly partial, legacy, malformed fields).

Output:
- fully normalized state object at latest version with defaults.

Required behaviors:
- sanitize and normalize all entities.
- guarantee required top-level keys exist.
- normalize `ui` and layout structure.
- clamp urgency/timing fields to supported values.
- reconcile `nextActionNumber` with existing numbered actions.

## Backward compatibility rules

- Older payloads are accepted and upgraded in place (non-throwing where possible).
- Legacy fields are mapped when known (`timeDependent` -> `timingFlag`, etc.).
- Unknown fields may be ignored by normalizers.
- Persisted writes always store latest version.

## Import/export formats

## Wrapper format

All backups use:

```json
{
  "exportedAt": "ISO-8601",
  "stateVersion": 12,
  "state": { "...canonical dashboard state...": "..." }
}
```

## Import modes

- `Merge`:
  - Numbered actions merged by `number` (dedupe map).
  - ID-based entities merged by `id` (imported item replaces on key collision).
  - UI preference fields prefer current/local when present.
- `Overwrite`:
  - Replace entire state snapshot after confirmation.

## Numbering reconciliation rules

- `computeNextActionNumber` scans `generalActions.number` and `schedulingActions.number`.
- Next number = `max(existingNumbers, DEFAULT_NEXT_NUMBER-1) + 1`.
- Imported or merged numbered rows are normalized before number extraction.

## Rich text storage and sanitization

## Stored representations

- `html` / `notesHtml`: canonical sanitized rich text.
- `html_inline`: inline projection for compact row rendering.
- `text` / `notesText`: plain text derivation for validation, filtering, and privacy rendering.

## Derivation rules

- `text` derives from rich HTML using DOM textContent normalization and whitespace collapse.
- `html_inline` derives from rich HTML projection preserving supported formatting and list markers.
- Empty plain text after sanitization invalidates note/action creation.

## Sanitization allowlist

Allowed tags only:
- `B`, `STRONG`, `I`, `EM`, `U`, `BR`, `P`, `UL`, `OL`, `LI`

Rules:
- disallowed elements are stripped while preserving child text content.
- attributes are not preserved by sanitizer reconstruction.
- resulting HTML is trimmed before storage.
