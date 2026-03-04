# Development Guide

## 1) Core implementation principles

- Keep render/state flows deterministic and migration-safe.
- Prefer state-driven rerender over ad-hoc DOM mutation when behaviour changed across many components.
- Keep autosync/import/auth interactions race-safe.

## 2) Idempotent DOM initialization

Use idempotent setup for controls that may be reprocessed after rerender:
- Before injecting controls, check if control group already exists.
- Before binding delegated handlers, guard with a module-level boolean.
- Avoid per-render listener rebinding on dynamic children.

Pattern:
- `initializeXControls()` can be called repeatedly without duplicating nodes.
- `bindXDelegatedEvents()` runs once.

## 3) Event delegation for dynamic elements (card move controls)

- Card move buttons (`.card-move-btn`) must be handled via a single delegated listener.
- Resolve target card id from closest card container or explicit dataset fallback.
- Route direction (`left/right/up/down`) to state-level move helpers.
- Recompute disabled/hidden states after each move.

## 4) Autosave patterns (meeting big edit)

- Track dirty timestamp when edit fields change.
- Debounce autosave (`setTimeout`, reset on subsequent input).
- Persist sanitized draft content locally before cloud sync.
- On close attempt with dirty state, confirm and force autosave.
- Ensure autosave + autosync coordination: local save marks dirty; autosync handles cloud push.

## 5) Filter parsing rules

Token parsing for `@person` and `#tag` must be newline-safe and rich-text-safe:
- Convert rich HTML to normalized plain text first.
- Match tokens with boundary-aware regex (start/whitespace/punctuation aware).
- Preserve original token case for display; compare case-insensitively.

## 6) Rich text: Tab/Shift+Tab and sanitization

- Preserve native list indent/outdent behaviour on Tab/Shift+Tab in editors.
- Sanitize all persisted rich text through allowlist filtering.
- Keep both rich HTML and plain-text projections in normalized records.

## 7) Whiteboard scope and persistence

General Notes big edit supports two modes:
- Text editor mode.
- Whiteboard mode.

Persisted whiteboard payload:
- `whiteboardDataUrl` for canvas snapshot.
- `whiteboardMeta` for optional metadata.
- `whiteboardImages` for placed image overlays (position/size/data URL).

Guidance:
- Save whiteboard payload only when touched/changed.
- Keep image reorder/select operations deterministic.

## 8) Import + sync coordination

- Set import lock during import transaction to prevent autosync/refresh race.
- Always migrate imported state before merge/overwrite logic.
- Recompute derived counters (`nextActionNumber`) after merge.

## 9) Code review checklist for these areas

- No duplicate listeners after rerender.
- No stale-node reorder assumptions (`insertBefore` safety).
- Autosave cannot silently drop valid edits.
- Filter extraction still works with multiline rich text.
- Whiteboard data remains valid `data:image/...` payloads.
