import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Home() {
  return (
    <Box sx={{ p: 4 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h3" component="h1">
          Home Page
        </Typography>
        <Typography color="text.secondary">
          This is a placeholder home route powered by React Router and MUI.
        </Typography>
        <Button component={RouterLink} variant="contained" to="/dashboard">
          Go to Dashboard
        </Button>
      </Stack>
    </Box>
  )
}

export default Home
