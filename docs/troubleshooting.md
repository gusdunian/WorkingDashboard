# Troubleshooting

## 1) Runtime error: `item is not defined`

### Symptoms
- UI partially loads, then interactions stop.
- Console shows `ReferenceError: item is not defined`.

### Diagnose
1. Open browser devtools console.
2. Capture full stack trace and source line.
3. Check whether the failing callback references loop/local variables outside their scope.
4. Validate recent refactors of render/event handlers for renamed parameters.

### Fix pattern
- Replace accidental free-variable references with explicit function args (`item`, `entry`, etc.).
- Add a guard return for nullish item where dynamic data is expected.
- Re-test initialization path from clean reload.

## 2) `insertBefore` `NotFoundError` or card reorder crash

### Symptoms
- Clicking card move controls throws `NotFoundError` or no-op after rerenders.

### Root cause
- Reorder logic assumes a stale DOM parent/child relation, then calls `insertBefore` with nodes no longer attached as expected.

### Robust fix pattern
- Use state-driven card layout operations first, then rerender.
- Keep control binding delegated (single document/container listener).
- Make control initialization idempotent so rerender does not duplicate controls/listeners.

## 3) Login succeeds but UI behaves oddly

### Symptoms
- Auth appears successful, but controls/editing/rendering are broken.

### Explanation
- JS init errors after auth can abort render/sync setup, leaving session active but app partially initialized.

### Steps
1. Check console for first uncaught error after login.
2. Fix that root error first (not downstream symptoms).
3. Hard refresh and verify full init sequence.

## 4) Import says success but data looks missing

### Checks
1. Export current backup and inspect JSON for expected entities.
2. Validate imported file actually contains `state` and expected lists.
3. Check Supabase row (`dashboard_state.state`) after import for persistence.
4. Confirm filters/privacy mode are not hiding records.
5. Verify whether merge mode deduped overlapping entities by identity.

## 5) Repeated “cloud updated elsewhere” notifications

### Typical causes
- Two active devices/tabs both writing.
- Local dirty state repeatedly regenerated.
- Import/recovery operations running concurrently with active editing.

### Resolution
1. Pause edits on all but one device.
2. Allow one clean cloud pull.
3. Make a single controlled edit and watch status.
4. If looping persists, inspect mutation path causing constant dirty writes.

## 6) Modal accidental close causing data loss concerns

### Current behaviour
- Meeting big edit now uses draft-aware autosave and close confirmation.
- Dirty close attempts autosave before closing.

### If data still appears lost
1. Reopen the same meeting; check saved draft fields.
2. Verify date/time/title validity (autosave requires minimally valid draft).
3. Confirm privacy mode was not enabled during attempted edit.

## 7) General diagnostic checklist

- Capture first console error and stack.
- Verify localStorage state parse/migration path.
- Verify network calls to Supabase succeed (auth + `dashboard_state`).
- Confirm `updated_at` changes after writes.
- Re-test with clean tab and single device session.
