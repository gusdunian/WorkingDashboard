# Changelog

This changelog tracks user-visible behaviour and data-model-affecting documentation updates.

## 2026-03-02

### UI changes
- Documented card move controls and robustness expectations (L/R/U/D controls, idempotent initialization, delegated handling).
- Documented meeting big edit autosave and draft-safe close flow.
- Documented global filter token parsing behaviour with newline-safe extraction.
- Documented current UI shell contract (banner controls, global filters location, top status philosophy, privacy toggle).
- Documented modal blur behaviour (content blur/obscure while preserving header context legibility).

### Data model changes
- Documented canonical `ui.cardLayout`, `ui.theme`, `ui.personFilter`, `ui.tagFilter`, and `ui.searchQuery` fields.
- Documented `archived` soft-delete semantics used by CC flows.
- Documented `meetingNotes.recorded` behaviour and action-reference shortcut token handling.
- Documented general note whiteboard persistence fields (`whiteboardDataUrl`, `whiteboardMeta`, `whiteboardImages`).
- Documented `stateVersion` expectations for `LATEST_STATE_VERSION = 12` and `migrateState` normalization responsibilities.
