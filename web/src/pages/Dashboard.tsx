import { Button, Card, CardContent, Chip, Grid, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Dashboard() {
  return (
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
                <TextField fullWidth label="Quick filter" placeholder="Search by owner, status, or tag" />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained">Run report</Button>
                  <Button variant="outlined">Create snapshot</Button>
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
  )
}

export default Dashboard
