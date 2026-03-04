import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h3" component="h1">
          Dashboard Page
        </Typography>
        <Typography color="text.secondary">
          This is a placeholder dashboard route.
        </Typography>
        <Button component={RouterLink} variant="outlined" to="/">
          Back Home
        </Button>
      </Stack>
    </Box>
  )
}

export default Dashboard
