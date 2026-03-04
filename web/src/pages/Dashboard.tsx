import { useEffect, useMemo, useState } from 'react';
import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardState } from '../lib/dashboardStateApi';

type DashboardState = Record<string, unknown>;

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

    const arrayCounts = Object.entries(state).reduce<Record<string, number>>((result, [key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.length;
      }
      return result;
    }, {});

    return {
      stateVersion: state.stateVersion ?? state.dashboardStateVersion ?? '—',
      nextActionNumber: state.nextActionNumber ?? '—',
      arrayCounts,
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
        {Object.entries(summary?.arrayCounts ?? {}).map(([key, count]) => (
          <Typography key={key} variant="body1">
            {key}: {count}
          </Typography>
        ))}
      </Paper>
      <Typography variant="body2" color="text.secondary">
        Read-only view.
      </Typography>
    </Stack>
  );
}
