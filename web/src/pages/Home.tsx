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
                  Use the Style Pack selector in the app bar to quickly change the visual system.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField fullWidth label="Project name" placeholder="Working Dashboard" />
                  <Button component={RouterLink} variant="contained" to="/dashboard">
                    Go to Dashboard
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
                <Typography variant="subtitle1">What changes per pack?</Typography>
                <Typography variant="body2" color="text.secondary">
                  Typography scale and weight, border radius, surface treatment, and component density.
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
