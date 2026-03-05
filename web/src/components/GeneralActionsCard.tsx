import { Button, Card, CardContent, Chip, Divider, List, ListItem, Stack, TextField, Typography } from '@mui/material';
import {
  addGeneralAction,
  getActionText,
  getGeneralActionKey,
  markGeneralActionFlag,
  type DashboardState,
  type GeneralActionItem,
  updateGeneralActionText,
} from '../lib/dashboardStateModel';

type GeneralActionsCardProps = {
  state: DashboardState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onStateChange: (nextState: DashboardState) => void;
  onSave: () => void;
};

function isHiddenAction(action: GeneralActionItem): boolean {
  return action.deleted === true || action.archived === true;
}

export function GeneralActionsCard({ state, disabled, dirty, saving, onStateChange, onSave }: GeneralActionsCardProps) {
  const actions = state.generalActions ?? [];

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">General actions</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {dirty ? <Chip size="small" label="Dirty" color="warning" /> : null}
              <Typography variant="body2" color="text.secondary">
                {actions.filter((action) => !isHiddenAction(action)).length}
              </Typography>
            </Stack>
          </Stack>
          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              fullWidth
              size="small"
              disabled={disabled || saving}
              label="Add action"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const target = event.target as HTMLInputElement;
                  if (!target.value.trim()) return;
                  onStateChange(addGeneralAction(state, target.value));
                  target.value = '';
                }
              }}
            />
            <Button
              variant="contained"
              disabled={!dirty || disabled || saving}
              onClick={onSave}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>

          {actions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {actions.map((action, index) => {
                if (isHiddenAction(action)) return null;
                const key = getGeneralActionKey(action, index);

                return (
                  <ListItem key={key} disableGutters divider>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={getActionText(action)}
                        disabled={disabled || saving}
                        onChange={(event) => {
                          onStateChange(updateGeneralActionText(state, key, event.target.value));
                        }}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={disabled || saving || action.completed === true}
                          onClick={() => onStateChange(markGeneralActionFlag(state, key, 'completed'))}
                        >
                          Complete
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={disabled || saving || action.deleted === true}
                          onClick={() => onStateChange(markGeneralActionFlag(state, key, 'deleted'))}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
