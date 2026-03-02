# Data Model

This document defines the canonical JSON persisted in `dashboard_state.state`.

## 1) Canonical root schema

```json
{
  "stateVersion": 12,
  "generalActions": [],
  "personalActions": [],
  "schedulingActions": [],
  "meetingNotes": [],
  "bigTicketItems": [],
  "generalNotes": [],
  "ui": {
    "collapsedCards": {},
    "cardLayout": { "columns": [[], []] },
    "collapsedGeneralNotesMonths": {},
    "theme": {
      "presetName": "Office Blue | Office Green | Office Gray | Custom",
      "vars": {
        "--banner-bg": "#...",
        "--banner-fg": "#...",
        "--page-bg": "#...",
        "--card-header-bg": "#...",
        "--card-header-fg": "#..."
      }
    },
    "dashboardTitle": "string",
    "personFilter": "All | @token",
    "tagFilter": "All | #token",
    "searchQuery": "string"
  },
  "meetingNotesUIState": {
    "collapsedMonths": {},
    "collapsedWeeks": {}
  },
  "nextActionNumber": 1
}
```

Notes:
- `ui.cardLayout` is authoritative for card column/order placement.
- `ui.theme.vars` is scoped to theme variables used by banner/page/card-header surfaces.
- `personFilter` / `tagFilter` / `searchQuery` are global filters.

## 2) Entity contracts

## Actions (`generalActions`, `schedulingActions`, `personalActions`)

Common fields:
- `text`, `html`, `html_inline`
- `createdAt`, `updatedAt`
- `completed`, `completedAt`
- `deleted`, `deletedAt`
- `archived` (soft-delete marker used by CC workflows)
- `urgencyLevel`
- `timingFlag` (`T`, `D`, or `null`)

Identity:
- General/scheduling use stable numeric `number`.
- Personal actions use generated string `id`.

### Archived semantics (CC)

`archived: true` is a soft-delete style retention flag used when items are cleared from active UI flow but intentionally retained in persisted state history.

## Meeting notes (`meetingNotes`)

Fields:
- `id`, `title`, `datetime`
- `notesHtml`, `notesText` (sanitized + plain text projection)
- `createdAt`, `updatedAt`
- `draft` (temporary draft record)
- `recorded` (boolean; UI renders `R` indicator)

### `%123%` / `%123` action reference behaviour

Meeting/general rich text supports action shortcut token parsing during editing.
When `%<number>%` (and accepted shorthand token forms) resolves to an existing action number, the editor injects a prefixed action reference line and removes the shortcut token.
Unresolved tokens remain plain text and surface a transient warning.

## General notes (`generalNotes`)

Fields:
- `id`, `date`, `title`
- `html`, `html_inline`, `text`
- `createdAt`, `updatedAt`
- `whiteboardDataUrl` (`data:image/...` snapshot or `null`)
- `whiteboardMeta` (optional object)
- `whiteboardImages` (optional placed image list with id/x/y/w/h/dataUrl)

## Big ticket (`bigTicketItems`)

Fields:
- `id`, `text`, `html`, `html_inline`
- `urgencyLevel`, `timingFlag`
- `createdAt`, `updatedAt`

## 3) Migration contract (`stateVersion` / `migrateState`)

- `LATEST_STATE_VERSION` is `12`.
- All reads pass through `migrateState(raw)` before use.
- All writes persist migrated/normalized state.
- Migration is additive/normalizing:
  - fills missing collections/objects,
  - normalizes rich text and derived plain-text fields,
  - normalizes `ui.cardLayout` to valid known cards,
  - normalizes theme + filters + title defaults,
  - normalizes archived and timing/urgency compatibility fields.

Expectation: callers do **not** consume un-migrated state directly.

## 4) Import/export expectations

- Export payload contains `exportedAt`, `stateVersion`, and `state`.
- Import path migrates incoming state first.
- `overwrite` mode replaces full snapshot after confirmation.
- `merge` mode merges by stable identity and recomputes `nextActionNumber`.
