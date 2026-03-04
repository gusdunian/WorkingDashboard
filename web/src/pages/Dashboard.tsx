import { useEffect, useMemo, useState } from 'react';
import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardState } from '../lib/dashboardStateApi';

type DashboardState = Record<string, unknown>;

function getCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) {
      setState(null);
      setUpdatedAt(null);
      setErrorMessage('');
      return;
    }

    let active = true;

    fetchDashboardState(user.id)
      .then((row) => {
        if (!active) return;
        setState((row?.state as DashboardState) ?? null);
        setUpdatedAt(row?.updated_at ?? null);
        setErrorMessage('');
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load dashboard state');
      });

    return () => {
      active = false;
    };
  }, [user]);

  const summary = useMemo(() => {
    if (!state) {
      return null;
    }

    return {
      stateVersion: state.stateVersion ?? state.dashboardStateVersion ?? '—',
      nextActionNumber: state.nextActionNumber ?? '—',
      generalActions: getCount(state.generalActions),
      schedulingActions: getCount(state.schedulingActions),
      bigTicketItems: getCount(state.bigTicketItems ?? state.bigTicket),
      meetingNotes: getCount(state.meetingNotes),
      generalNotes: getCount(state.generalNotes),
    };
  }, [state]);

  if (!user) {
    return <Typography>Please sign in to load your dashboard.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Dashboard Summary</Typography>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
        </Typography>
        <Typography variant="body1">stateVersion: {summary?.stateVersion ?? '—'}</Typography>
        <Typography variant="body1">nextActionNumber: {summary?.nextActionNumber ?? '—'}</Typography>
        <Typography variant="body1">generalActions: {summary?.generalActions ?? 0}</Typography>
        <Typography variant="body1">schedulingActions: {summary?.schedulingActions ?? 0}</Typography>
        <Typography variant="body1">bigTicketItems: {summary?.bigTicketItems ?? 0}</Typography>
        <Typography variant="body1">meetingNotes: {summary?.meetingNotes ?? 0}</Typography>
        <Typography variant="body1">generalNotes: {summary?.generalNotes ?? 0}</Typography>
      </Paper>
      <Typography variant="body2" color="text.secondary">
        Read-only view.
      </Typography>
    </Stack>
  );
}
