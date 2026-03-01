# Development Guide

## Working agreements

## Branch strategy

- Create short-lived feature branches from `main`.
- Keep branch scope focused (single feature/fix/docs change set).
- Rebase or merge `main` before final PR to reduce deployment risk.

## PR checklist

- [ ] Behavior changes covered by tests/checks or explicit manual validation.
- [ ] `/docs` updated for architecture/data/security/ops/UI changes.
- [ ] No secrets/private URLs/keys added.
- [ ] No regressions in auth/sync/import/export paths.
- [ ] Changelog updated.

## Testing checklist (minimum)

### Desktop
- Sign-in/sign-out flows.
- Create/edit/delete actions, meetings, big-ticket items, notes.
- Settings modal save/cancel + theme preview/revert.
- Import/export roundtrip.

### Mobile/responsive
- Card collapse/expand.
- Modal usability and control accessibility.
- Card reorder controls (left/right disabled on narrow viewport).

### Multi-device
- Two sessions with concurrent edits.
- Confirm stale device performs pull-on-conflict instead of overwrite.
- Confirm focus refresh updates stale tab.

## Code structure conventions

## State store conventions

- Keep canonical state shape aligned with `migrateState` output.
- Persisted state changes go through save helpers (`saveList`, `saveMeetings`, etc.).
- Any state mutation must update `updatedAt` where entity uses it.
- Use `syncAppStateFromMemory()` before serialization/export/sync push.

## Render pipeline conventions

- `renderAll()` is authoritative for full re-render order.
- Avoid hidden side effects inside render helpers.
- Any UI state update should re-render affected modules consistently.

## Event handler conventions

- Prevent default for controlled form submissions.
- Stop event propagation on nested row controls to avoid accidental modal open.
- Guard mutating handlers with privacy mode checks where required.

## Component patterns (cards/modals/editors)

### Cards
- Keep card identity stable via `data-card-id`.
- Card body visibility must bind to `ui.collapsedCards[cardId]` only.
- Reorder buttons should be generated/updated centrally.

### Modals
- Open/close helpers should own focus behavior and cleanup.
- Save handlers sanitize and validate before persistence.
- Cancel handlers must not mutate persisted data.

### Editors
- Always sanitize rich HTML before write.
- Maintain `html`, `html_inline`, and plain text derivations in sync.
- Keep toolbar commands aligned with allowed sanitizer tags.

## Adding new features

## Add a new card

1. Add card markup to `index.html` with unique `data-card-id` and toggle binding.
2. Extend `collapsedCardsDefault` and `cardLayoutDefault`.
3. Ensure render helper integrates into `renderAll()`.
4. Ensure card participates in collapse-all and layout movement.
5. Update docs (`architecture.md`, this file).

## Add new state fields

1. Add field to canonical default/normalizer.
2. Extend `migrateState` to backfill defaults for older versions.
3. If breaking schema, bump `LATEST_STATE_VERSION`.
4. Add import/export compatibility rules in docs.
5. Add changelog entry under breaking/data model sections.

## Add new filters and keep global scope

1. Add extraction logic for new token type (or equivalent metadata source).
2. Add selected value to `ui` persisted state.
3. Wire all relevant cards to same selected value.
4. Persist filter via `saveUiState({ markDirty:false, autosync:false })` when view-only.
5. Validate filter reset behavior when token disappears.

## Performance considerations

- Favor local-first updates and incremental DOM changes.
- Keep autosync debounced; avoid immediate network write per keystroke.
- Reuse normalized/derived values (`html_inline`, parsed tags) instead of recomputing excessively.
- Keep render loops linear in item count.
- Use minimal re-rendering where feasible, but prioritize consistency over micro-optimizations.

## Accessibility requirements

- All actionable controls must be keyboard reachable.
- Use visible focus states (`:focus-visible`) on interactive elements.
- Keep button hit targets suitable for touch (minimum practical size).
- Preserve semantic labels for icon-only controls (`aria-label`).
- Ensure modal dialogs are closable via Escape and close controls.

## UI Component Spec (reusable, implementation-level)

This section is a reusable UI contract for implementing equivalent dashboard UX in other applications.

### Banner component

- **Layout**:
  - left cluster: icon + title + current date
  - right cluster: auth controls + status row
- **Title**:
  - editable via settings; persisted in UI state
  - mirrored to browser document title
- **Date**:
  - recomputed at render; long weekday/month format with ordinal day suffix
- **Auth states**:
  - signed-out: email/password + sign-in button only
  - signed-in: compact “Signed in” chip + ordered buttons `Sign out → Export → Import → Settings`
- **Privacy toggle**:
  - located in status row immediately before Hide/Expand
  - shows `Privacy` (off) / `Privacy On` (on) and `aria-pressed`
- **Sync status bar**:
  - always visible in header status row
  - authoritative source for sync/loading/error state
  - no duplicate persistent status widget elsewhere

### Settings modal component

- **Inputs**:
  - Dashboard title text input (max 120)
  - Theme preset select (office-like presets + Custom)
  - Five color pickers (banner bg/fg, page bg, card-header bg/fg)
- **Scope contract**:
  - Theme only affects banner/page/card-header variables
  - Do not apply theme to semantic state colors or control meaning
- **Behavior**:
  - opening loads persisted snapshot
  - changing preset applies preset values immediately as preview
  - editing any color moves preset to `Custom`
  - Cancel reverts preview
  - Save persists theme + title

### Global controls component

- **Hide/Expand all**:
  - reads aggregate collapse state and toggles all cards
  - button label flips based on whether all cards currently collapsed
- **Global filters placement**:
  - people/tag selectors present in card toolbars and synchronized
  - effective filter state is global, not local to a single card
- **Token parsing**:
  - people `@token`, tags `#token`
  - robust to line breaks/rich text by deriving from plain text projection
  - case-insensitive comparison, case-preserving display

### Card container component

- **Header strip**:
  - icon + title + move controls + chevron
- **Collapse**:
  - collapsed card body hidden entirely (no reserved body spacing)
- **Layout persistence**:
  - column and in-column order persisted
  - move semantics:
    - left/right = column move
    - up/down = within-column reorder
  - responsive rule: disable left/right on narrow viewport

### Editor component

- **Formatting controls**: B, I, U, bullets, numbered list.
- **Keyboard shortcuts**:
  - Cmd/Ctrl B/I/U, Cmd/Ctrl Shift 8/7.
- **Tab behavior**:
  - preserve native list-item indent/outdent on Tab/Shift+Tab.
- **Sanitization**:
  - store only allowlisted tags.
- **Inline rendering**:
  - list rows use `html_inline` compact projection; full editors use rich HTML.

### Modal system component

- **Defaults**:
  - centered dialog + backdrop + close control.
- **Resizing/layout**:
  - larger edit modals may be scrollable and wide.
- **Footer order**:
  - secondary actions (Dictate/Cancel) before primary Save/Import.
- **Backdrop/blur**:
  - visual suppression should prioritize content region while keeping fixed header context legible.
- **Dictation**:
  - toggle states `Dictate/Stop`
  - fallback warning when Web Speech API unavailable

### Action list component

- **Priority model**:
  - `!!`, `!`, normal, `L` cycle order.
- **Right-side toggles**:
  - urgency button, timing/delegation button (`T`/`D`), delete toggle.
- **Ordering**:
  - urgency buckets then completed then deleted.
  - time-dependent (`T`) sorted to top inside same urgency bucket.
- **Highlights**:
  - temporary highlight on add/move/state-cycle.
- **Text display**:
  - single-line inline projection with overflow expand (`+`) opening detail modal.

### Meeting notes component

- **Grouping**:
  - Month > Week (W/C) > meeting rows.
- **Hierarchy persistence**:
  - separate collapse maps for month and week.
- **Create/edit rules**:
  - required title/date/time/notes.
  - datetime stored ISO; view labels formatted locally.
- **Auto date/time on title typing (reuse contract)**:
  - preferred behavior for new implementations: if title entry begins and date/time empty, prefill with now rounded to allowed interval.
- **Recorded flag (`R`)**:
  - represent as title convention `(R)`; preserve literally.
- **`%123%` action injection**:
  - preserve token text; optional integration layer can parse and link to action #123.

### General notes component

- **Grouping**:
  - month buckets with collapse persistence.
- **Edit modes**:
  - text tab + whiteboard tab in same edit modal.
- **Whiteboard model**:
  - persisted as data URL image + metadata.
  - save only when touched/changed.
- **Toolset**:
  - pen, eraser, line, rectangle, circle, text; color/width; undo; clear.
