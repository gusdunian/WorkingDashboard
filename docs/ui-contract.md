# UI Contract (Style Trial)

## Scope
This contract applies to `/web/**` for the UI style trial branch.

## Mandatory Layout Wrapper
- `AppShellMUI` (`web/src/components/AppShellMUI.jsx`) is the required wrapper for all signed-in pages.
- Signed-in pages must render inside the AppShell content area to preserve shared AppBar, Drawer navigation, and spacing.

## Styling Source of Truth
- MUI theme tokens in `web/src/ui/theme.js` are the single source of truth for palette, shape, and typography.
- MUI layout and surface components are required for this branch.
- Raw hex colors must not be introduced outside `web/src/ui/theme.js`.

## Surface Requirements
- Inbox and AI views must be rendered inside MUI `Paper` surfaces with theme spacing.
- Action Dashboard must be wrapped in a MUI `Paper` surface with consistent spacing.
- Style Reference remains available as the visual verification page for theme quality checks.

## Modal Guardrail
- Existing Settings, Compose, and Message Preview modal logic remains unchanged in this branch.
- Modals may receive light spacing compatibility adjustments only; no functional rewrites.
