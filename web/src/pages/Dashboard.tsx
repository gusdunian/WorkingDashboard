import { useEffect, useMemo, useState } from 'react';
import { Alert, Chip, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardState } from '../lib/dashboardStateApi';
import { buildDashboardSections, type DashboardState } from '../lib/dashboardSections';
import { DashboardSectionCard } from '../components/DashboardSectionCard';

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

  const sections = useMemo(() => {
    if (!state) {
      return [];
    }

    return buildDashboardSections(state);
  }, [state]);

  if (!user) {
    return <Typography>Please sign in to load your dashboard.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Dashboard</Typography>
        <Chip size="small" label="Read-only" color="default" variant="outlined" />
      </Stack>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      <Typography variant="body2" color="text.secondary">
        Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {sections.slice(0, 2).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {sections.slice(2, 4).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {sections.slice(4, 6).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
