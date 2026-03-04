import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Home
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Welcome</Typography>
                <Typography color="text.secondary">
                  Pick a style pack from the app bar to preview typography scale, surface treatment, and density changes.
                </Typography>
                <TextField fullWidth label="Workspace" placeholder="Angus Working Dashboard" />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained">Save Preferences</Button>
                  <Button component={RouterLink} variant="outlined" to="/dashboard">
                    Open Dashboard
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Stack spacing={1.25}>
                <Typography variant="subtitle1">Pack behavior</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gmail and Minimal feel compact, SaaS is comfortable with elevated cards, and Enterprise is dense but readable.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Home
