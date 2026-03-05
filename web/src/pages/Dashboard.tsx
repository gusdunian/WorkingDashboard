import { useEffect, useMemo, useState } from 'react';
import { Alert, Chip, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardState, upsertDashboardState } from '../lib/dashboardStateApi';
import { buildDashboardSections } from '../lib/dashboardSections';
import { DashboardSectionCard } from '../components/DashboardSectionCard';
import { GeneralActionsCard } from '../components/GeneralActionsCard';
import { normalizeDashboardState, type DashboardState } from '../lib/dashboardStateModel';

export default function Dashboard() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState | null>(null);
  const [persistedState, setPersistedState] = useState<DashboardState | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setState(null);
      setPersistedState(null);
      setUpdatedAt(null);
      setErrorMessage('');
      setSaveErrorMessage('');
      return;
    }

    let active = true;

    fetchDashboardState(user.id)
      .then((row) => {
        if (!active) return;
        const normalizedState = normalizeDashboardState(row?.state);
        setState(normalizedState);
        setPersistedState(normalizedState);
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

    return buildDashboardSections(state).filter((section) => section.key !== 'generalActions');
  }, [state]);

  const isDirty = useMemo(() => {
    if (!state || !persistedState) return false;
    return JSON.stringify(state) !== JSON.stringify(persistedState);
  }, [state, persistedState]);

  const handleSave = async () => {
    if (!user || !state || !isDirty) return;

    setIsSaving(true);
    setSaveErrorMessage('');

    try {
      const data = await upsertDashboardState(user.id, state);
      setPersistedState(state);
      setUpdatedAt(data.updated_at ?? null);
    } catch (error) {
      setSaveErrorMessage(error instanceof Error ? error.message : 'Unable to save dashboard state');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <Typography>Please sign in to load your dashboard.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Dashboard</Typography>
        <Chip size="small" label="Mostly read-only" color="default" variant="outlined" />
      </Stack>
      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {saveErrorMessage ? <Alert severity="error">{saveErrorMessage}</Alert> : null}
      <Typography variant="body2" color="text.secondary">
        Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {state ? (
              <GeneralActionsCard
                state={state}
                disabled={!user}
                dirty={isDirty}
                saving={isSaving}
                onStateChange={(nextState) => {
                  setState(nextState);
                  setSaveErrorMessage('');
                }}
                onSave={handleSave}
              />
            ) : null}
            {sections.slice(0, 1).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {sections.slice(1, 3).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {sections.slice(3, 5).map((section) => (
              <DashboardSectionCard key={section.key} section={section} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
