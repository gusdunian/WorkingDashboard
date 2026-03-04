import { createTheme, type Theme } from '@mui/material/styles'

export type StylePack = 'gmail' | 'saas' | 'enterprise' | 'minimal'

type SurfaceStyle = 'outlined' | 'elevation'
type Density = 'compact' | 'comfortable' | 'dense'

type PackConfig = {
  borderRadius: number
  surfaceStyle: SurfaceStyle
  paperElevation: number
  density: Density
  palette: {
    mode: 'light'
    primary: { main: string }
    secondary: { main: string }
    background: { default: string; paper: string }
  }
  typography: Theme['typography']
}

const packConfigs: Record<StylePack, PackConfig> = {
  gmail: {
    borderRadius: 12,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'compact',
    palette: {
      mode: 'light',
      primary: { main: '#1a73e8' },
      secondary: { main: '#5f6368' },
      background: { default: '#f1f3f4', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Roboto, Inter, Helvetica, Arial, sans-serif',
      h1: { fontSize: '2.35rem', fontWeight: 500, letterSpacing: '-0.02em' },
      h2: { fontSize: '1.95rem', fontWeight: 500, letterSpacing: '-0.015em' },
      h4: { fontSize: '1.7rem', fontWeight: 500 },
      h5: { fontSize: '1.35rem', fontWeight: 500 },
      h6: { fontSize: '1.08rem', fontWeight: 500 },
      body1: { fontSize: '0.94rem', lineHeight: 1.55, fontWeight: 400 },
      body2: { fontSize: '0.84rem', lineHeight: 1.5, fontWeight: 400 },
      button: { fontSize: '0.83rem', fontWeight: 600, textTransform: 'none' },
    },
  },
  saas: {
    borderRadius: 16,
    surfaceStyle: 'elevation',
    paperElevation: 5,
    density: 'comfortable',
    palette: {
      mode: 'light',
      primary: { main: '#6750a4' },
      secondary: { main: '#3f51b5' },
      background: { default: '#f5f7fb', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontSize: '2.15rem', fontWeight: 750, letterSpacing: '-0.02em' },
      h4: { fontSize: '1.95rem', fontWeight: 700 },
      h5: { fontSize: '1.55rem', fontWeight: 700 },
      h6: { fontSize: '1.2rem', fontWeight: 650 },
      body1: { fontSize: '1rem', lineHeight: 1.65, fontWeight: 400 },
      body2: { fontSize: '0.9rem', lineHeight: 1.55, fontWeight: 400 },
      button: { fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase' },
    },
  },
  enterprise: {
    borderRadius: 6,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'dense',
    palette: {
      mode: 'light',
      primary: { main: '#0b5cab' },
      secondary: { main: '#44536a' },
      background: { default: '#eef2f7', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: '2.1rem', fontWeight: 700 },
      h2: { fontSize: '1.8rem', fontWeight: 700 },
      h4: { fontSize: '1.55rem', fontWeight: 700 },
      h5: { fontSize: '1.25rem', fontWeight: 700 },
      h6: { fontSize: '1rem', fontWeight: 700 },
      body1: { fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: '0.82rem', lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' },
    },
  },
  minimal: {
    borderRadius: 4,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'compact',
    palette: {
      mode: 'light',
      primary: { main: '#212121' },
      secondary: { main: '#616161' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"IBM Plex Sans", Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: '2rem', fontWeight: 600 },
      h2: { fontSize: '1.7rem', fontWeight: 600 },
      h4: { fontSize: '1.45rem', fontWeight: 600 },
      h5: { fontSize: '1.2rem', fontWeight: 600 },
      h6: { fontSize: '0.98rem', fontWeight: 600 },
      body1: { fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: '0.8rem', lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: '0.8rem', fontWeight: 600, textTransform: 'none' },
    },
  },
}

const densityDefaults: Record<Density, { buttonSize: 'small' | 'medium'; textFieldSize: 'small' | 'medium'; toolbarHeight: number; listItemMinHeight: number; inputPy: number; inputPx: number }> = {
  compact: {
    buttonSize: 'small',
    textFieldSize: 'small',
    toolbarHeight: 56,
    listItemMinHeight: 38,
    inputPy: 8,
    inputPx: 10,
  },
  comfortable: {
    buttonSize: 'medium',
    textFieldSize: 'medium',
    toolbarHeight: 64,
    listItemMinHeight: 44,
    inputPy: 10,
    inputPx: 12,
  },
  dense: {
    buttonSize: 'small',
    textFieldSize: 'small',
    toolbarHeight: 58,
    listItemMinHeight: 40,
    inputPy: 9,
    inputPx: 11,
  },
}

export function createAppTheme(stylePack: StylePack): Theme {
  const config = packConfigs[stylePack] ?? packConfigs.enterprise
  const density = densityDefaults[config.density]

  return createTheme({
    palette: config.palette,
    shape: {
      borderRadius: config.borderRadius,
    },
    typography: config.typography,
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: config.surfaceStyle === 'elevation' ? config.paperElevation : 0,
          variant: config.surfaceStyle === 'outlined' ? 'outlined' : 'elevation',
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          variant: config.surfaceStyle === 'outlined' ? 'outlined' : 'elevation',
          elevation: config.surfaceStyle === 'elevation' ? config.paperElevation : 0,
        },
      },
      MuiButton: {
        defaultProps: {
          size: density.buttonSize,
        },
      },
      MuiTextField: {
        defaultProps: {
          size: density.textFieldSize,
          variant: 'outlined',
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: config.borderRadius,
          },
          input: {
            paddingTop: density.inputPy,
            paddingBottom: density.inputPy,
            paddingLeft: density.inputPx,
            paddingRight: density.inputPx,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: density.listItemMinHeight,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: density.toolbarHeight,
          },
        },
      },
    },
  })
}
