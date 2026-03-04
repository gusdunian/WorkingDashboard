import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h4" component="h1">
              Home
            </Typography>
            <Typography color="text.secondary">
              This is the primary route using MUI layout primitives.
            </Typography>
            <Button component={RouterLink} variant="contained" to="/dashboard">
              Go to Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home
