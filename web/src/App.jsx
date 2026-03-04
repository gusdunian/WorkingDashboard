import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AppShellMUI from './components/AppShellMUI';
import './App.css';

function InboxPage() {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Existing inbox list and handlers should render in this surface.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          AI Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Existing AI content and actions should render unchanged inside this panel.
        </Typography>
      </Paper>
    </Stack>
  );
}

function ActionDashboardPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Action Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Existing Action Dashboard widgets remain functional and sync logic remains unchanged.
      </Typography>
    </Paper>
  );
}

function StyleReferencePage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Style Reference
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Use this page to verify global theme colors, spacing, and surface style.
      </Typography>
    </Paper>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('inbox');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPosition] = useState('left');
  const [accountId, setAccountId] = useState('default');

  const pages = useMemo(
    () => [
      { id: 'inbox', label: 'Inbox', icon: <InboxIcon fontSize="small" /> },
      { id: 'action-dashboard', label: 'Action Dashboard', icon: <DashboardIcon fontSize="small" /> },
      { id: 'style-reference', label: 'Style Reference', icon: <PaletteIcon fontSize="small" /> },
    ],
    [],
  );

  const headerRight = (
    <>
      <Chip color="success" label="Operational" size="small" />
      <Select
        size="small"
        value={accountId}
        onChange={(event) => setAccountId(event.target.value)}
      >
        <MenuItem value="default">Default Account</MenuItem>
      </Select>
      <Button size="small" startIcon={<SettingsIcon />}>
        Settings
      </Button>
      <Button size="small" color="error" startIcon={<LogoutIcon />}>
        Sign out
      </Button>
    </>
  );

  return (
    <AppShellMUI
      pages={pages}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      sidebarPosition={sidebarPosition}
      headerRight={headerRight}
    >
      <Box>
        {currentPage === 'inbox' && <InboxPage />}
        {currentPage === 'action-dashboard' && <ActionDashboardPage />}
        {currentPage === 'style-reference' && <StyleReferencePage />}
      </Box>
    </AppShellMUI>
  );
}
