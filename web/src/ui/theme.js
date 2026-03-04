import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f766e',
      light: '#14b8a6',
      dark: '#115e59',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f3f6fb',
      paper: '#ffffff',
    },
    success: {
      main: '#15803d',
    },
    warning: {
      main: '#b45309',
    },
    error: {
      main: '#b91c1c',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
});

export default theme;
