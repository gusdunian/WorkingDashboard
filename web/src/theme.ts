import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
})

export default theme
