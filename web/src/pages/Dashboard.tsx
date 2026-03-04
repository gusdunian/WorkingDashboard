import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Dashboard() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={2}>
        <CardContent>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Typography color="text.secondary">
              This is a secondary route demonstrating client-side routing.
            </Typography>
            <Button component={RouterLink} variant="outlined" to="/">
              Back Home
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Dashboard
