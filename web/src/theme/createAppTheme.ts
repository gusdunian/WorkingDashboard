import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles'

type TypographyOptions = NonNullable<ThemeOptions['typography']>

export type StylePack = 'gmail' | 'saas' | 'enterprise' | 'minimal'

type SurfaceStyle = 'outlined' | 'elevation'
type Density = 'compact' | 'comfortable' | 'dense'

type PackConfig = {
  theme: ThemeOptions
  borderRadius: number
  surfaceStyle: SurfaceStyle
  paperElevation: number
  density: Density
  typography: TypographyOptions
}

const packConfigs: Record<StylePack, PackConfig> = {
  gmail: {
    borderRadius: 12,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'compact',
    typography: {
      fontFamily: 'Roboto, Inter, Helvetica, Arial, sans-serif',
      h1: { fontSize: 37.6, fontWeight: 500, letterSpacing: '-0.02em' },
      h2: { fontSize: 31.2, fontWeight: 500, letterSpacing: '-0.015em' },
      h4: { fontSize: 27.2, fontWeight: 500 },
      h5: { fontSize: 21.6, fontWeight: 500 },
      h6: { fontSize: 17.28, fontWeight: 500 },
      body1: { fontSize: 15.04, lineHeight: 1.55, fontWeight: 400 },
      body2: { fontSize: 13.44, lineHeight: 1.5, fontWeight: 400 },
      button: { fontSize: 13.28, fontWeight: 600, textTransform: 'none' },
    } satisfies TypographyOptions,
    theme: {
      palette: {
        mode: 'light',
        primary: { main: '#1a73e8' },
        secondary: { main: '#5f6368' },
        background: { default: '#f1f3f4', paper: '#ffffff' },
      },
    } satisfies ThemeOptions,
  },
  saas: {
    borderRadius: 16,
    surfaceStyle: 'elevation',
    paperElevation: 5,
    density: 'comfortable',
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: 41.6, fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontSize: 34.4, fontWeight: 750, letterSpacing: '-0.02em' },
      h4: { fontSize: 31.2, fontWeight: 700 },
      h5: { fontSize: 24.8, fontWeight: 700 },
      h6: { fontSize: 19.2, fontWeight: 650 },
      body1: { fontSize: 16, lineHeight: 1.65, fontWeight: 400 },
      body2: { fontSize: 14.4, lineHeight: 1.55, fontWeight: 400 },
      button: { fontSize: 13.44, fontWeight: 700, textTransform: 'uppercase' },
    } satisfies TypographyOptions,
    theme: {
      palette: {
        mode: 'light',
        primary: { main: '#6750a4' },
        secondary: { main: '#3f51b5' },
        background: { default: '#f5f7fb', paper: '#ffffff' },
      },
    } satisfies ThemeOptions,
  },
  enterprise: {
    borderRadius: 6,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'dense',
    typography: {
      fontFamily: '"Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: 33.6, fontWeight: 700 },
      h2: { fontSize: 28.8, fontWeight: 700 },
      h4: { fontSize: 24.8, fontWeight: 700 },
      h5: { fontSize: 20, fontWeight: 700 },
      h6: { fontSize: 16, fontWeight: 700 },
      body1: { fontSize: 14.72, lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: 13.12, lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: 12.48, fontWeight: 700, textTransform: 'uppercase' },
    } satisfies TypographyOptions,
    theme: {
      palette: {
        mode: 'light',
        primary: { main: '#0b5cab' },
        secondary: { main: '#44536a' },
        background: { default: '#eef2f7', paper: '#ffffff' },
      },
    } satisfies ThemeOptions,
  },
  minimal: {
    borderRadius: 4,
    surfaceStyle: 'outlined',
    paperElevation: 0,
    density: 'compact',
    typography: {
      fontFamily: '"IBM Plex Sans", Inter, Roboto, Helvetica, Arial, sans-serif',
      h1: { fontSize: 32, fontWeight: 600 },
      h2: { fontSize: 27.2, fontWeight: 600 },
      h4: { fontSize: 23.2, fontWeight: 600 },
      h5: { fontSize: 19.2, fontWeight: 600 },
      h6: { fontSize: 15.68, fontWeight: 600 },
      body1: { fontSize: 14.4, lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: 12.8, lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: 12.8, fontWeight: 600, textTransform: 'none' },
    } satisfies TypographyOptions,
    theme: {
      palette: {
        mode: 'light',
        primary: { main: '#212121' },
        secondary: { main: '#616161' },
        background: { default: '#fafafa', paper: '#ffffff' },
      },
    } satisfies ThemeOptions,
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
    ...config.theme,
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
