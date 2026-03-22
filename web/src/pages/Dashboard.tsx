import { useState } from 'react'
import { Alert, Button, Card, CardContent, Chip, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useDashboardState } from '../context/DashboardStateContext'
import {
  buildMigrationExport,
  buildMigrationFilename,
  downloadJsonFile,
  getPersistedDashboardState,
  resolveFreshestDashboardState,
} from '../lib/dashboardState'

function Dashboard() {
  const { cloudLoadedState, currentUserId, setQuickFilter, state } = useDashboardState()
  const [isToastOpen, setIsToastOpen] = useState(false)

  const persistedState = getPersistedDashboardState()
  const dashboardState = resolveFreshestDashboardState({
    inMemoryState: state,
    persistedState,
    cloudLoadedState,
  })

  const handleMigrationExport = () => {
    const freshestState = resolveFreshestDashboardState({
      inMemoryState: state,
      persistedState: getPersistedDashboardState(),
      cloudLoadedState,
    })

    const exportedAt = new Date().toISOString()
    const payload = buildMigrationExport({
      state: freshestState,
      sourceUserId: currentUserId,
      exportedAt,
    })

    downloadJsonFile(buildMigrationFilename(exportedAt), payload)
    setIsToastOpen(true)
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Overview</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip color="primary" label="Active" />
                    <Chip variant="outlined" label="Team View" />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Quick filter"
                    placeholder="Search by owner, status, or tag"
                    value={dashboardState.ui.quickFilter}
                    onChange={(event) => setQuickFilter(event.target.value)}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
                    <Button variant="contained">Run report</Button>
                    <Button variant="outlined">Create snapshot</Button>
                    <Button variant="outlined" onClick={handleMigrationExport}>
                      Data_Migration_Export
                    </Button>
                    <Button component={RouterLink} variant="text" to="/">
                      Back Home
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Persistence check</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Change the style pack, refresh the page, and confirm the selected pack is restored from localStorage.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>

      <Snackbar autoHideDuration={3000} open={isToastOpen} onClose={() => setIsToastOpen(false)}>
        <Alert severity="success" variant="filled" onClose={() => setIsToastOpen(false)}>
          Migration export downloaded.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Dashboard
