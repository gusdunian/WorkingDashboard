import { Box, Button, Stack } from '@mui/material';

const legacySrc = import.meta.env.DEV
  ? 'https://gusdunian.github.io/WorkingDashboard/?embed=1'
  : '/WorkingDashboard/?embed=1';

export default function LegacyDashboard() {
  return (
    <Stack spacing={1.5} sx={{ height: 'calc(100vh - 116px)' }}>
      <Box>
        <Button
          variant="outlined"
          size="small"
          href={legacySrc}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open legacy in new tab
        </Button>
      </Box>
      <Box
        component="iframe"
        title="Legacy Dashboard"
        src={legacySrc}
        sx={{
          width: '100%',
          flex: 1,
          border: 0,
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      />
    </Stack>
  );
}
