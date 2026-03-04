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
                  <Chip variant="outlined" label="Demo" />
                </Stack>
                <TextField fullWidth label="Quick filter" placeholder="Type to filter widgets" />
                <Stack direction="row" spacing={1.5}>
                  <Button variant="contained">Run report</Button>
                  <Button component={RouterLink} variant="outlined" to="/">
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
                <Typography variant="subtitle1">Pack testing tip</Typography>
                <Typography variant="body2" color="text.secondary">
                  Refresh after selecting a style pack to verify persistence from localStorage.
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
