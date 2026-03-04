import { createTheme } from '@mui/material/styles'

export type StylePack = 'gmail' | 'saas' | 'enterprise' | 'minimal'

type PackConfig = {
  borderRadius: number
  cardVariant: 'outlined' | 'elevation'
  cardElevation: number
  buttonSize: 'small' | 'medium' | 'large'
  fieldSize: 'small' | 'medium'
  buttonPadding: string
  fieldPaddingY: number
  fieldPaddingX: number
  palette: {
    mode: 'light'
    primary: { main: string }
    secondary: { main: string }
    background: { default: string; paper: string }
  }
  typography: {
    fontFamily: string
    h4: { fontSize: string; fontWeight: number; letterSpacing?: string }
    h5: { fontSize: string; fontWeight: number; letterSpacing?: string }
    h6: { fontSize: string; fontWeight: number; letterSpacing?: string }
    subtitle1: { fontSize: string; fontWeight: number }
    body1: { fontSize: string; lineHeight: number; fontWeight: number }
    body2: { fontSize: string; lineHeight: number; fontWeight: number }
    button: { fontSize: string; fontWeight: number; textTransform?: 'none' | 'uppercase' }
  }
}

const packConfigs: Record<StylePack, PackConfig> = {
  gmail: {
    borderRadius: 16,
    cardVariant: 'elevation',
    cardElevation: 1,
    buttonSize: 'large',
    fieldSize: 'medium',
    buttonPadding: '10px 22px',
    fieldPaddingY: 12,
    fieldPaddingX: 14,
    palette: {
      mode: 'light',
      primary: { main: '#1a73e8' },
      secondary: { main: '#5f6368' },
      background: { default: '#f1f3f4', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Roboto, Inter, Helvetica, Arial, sans-serif',
      h4: { fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.01em' },
      h5: { fontSize: '1.6rem', fontWeight: 500 },
      h6: { fontSize: '1.2rem', fontWeight: 500 },
      subtitle1: { fontSize: '1rem', fontWeight: 500 },
      body1: { fontSize: '1rem', lineHeight: 1.7, fontWeight: 400 },
      body2: { fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 400 },
      button: { fontSize: '0.95rem', fontWeight: 600, textTransform: 'none' },
    },
  },
  saas: {
    borderRadius: 20,
    cardVariant: 'elevation',
    cardElevation: 5,
    buttonSize: 'medium',
    fieldSize: 'small',
    buttonPadding: '8px 20px',
    fieldPaddingY: 10,
    fieldPaddingX: 12,
    palette: {
      mode: 'light',
      primary: { main: '#6750a4' },
      secondary: { main: '#3f51b5' },
      background: { default: '#f5f7fb', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
      h4: { fontSize: '2.1rem', fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontSize: '1.7rem', fontWeight: 700 },
      h6: { fontSize: '1.25rem', fontWeight: 650 },
      subtitle1: { fontSize: '1rem', fontWeight: 600 },
      body1: { fontSize: '1rem', lineHeight: 1.65, fontWeight: 400 },
      body2: { fontSize: '0.9rem', lineHeight: 1.55, fontWeight: 400 },
      button: { fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase' },
    },
  },
  enterprise: {
    borderRadius: 8,
    cardVariant: 'outlined',
    cardElevation: 0,
    buttonSize: 'small',
    fieldSize: 'small',
    buttonPadding: '6px 14px',
    fieldPaddingY: 8,
    fieldPaddingX: 10,
    palette: {
      mode: 'light',
      primary: { main: '#0b5cab' },
      secondary: { main: '#44536a' },
      background: { default: '#eef2f7', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif',
      h4: { fontSize: '1.8rem', fontWeight: 700 },
      h5: { fontSize: '1.45rem', fontWeight: 700 },
      h6: { fontSize: '1.08rem', fontWeight: 700 },
      subtitle1: { fontSize: '0.97rem', fontWeight: 600 },
      body1: { fontSize: '0.95rem', lineHeight: 1.5, fontWeight: 400 },
      body2: { fontSize: '0.85rem', lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' },
    },
  },
  minimal: {
    borderRadius: 4,
    cardVariant: 'outlined',
    cardElevation: 0,
    buttonSize: 'medium',
    fieldSize: 'medium',
    buttonPadding: '7px 16px',
    fieldPaddingY: 9,
    fieldPaddingX: 11,
    palette: {
      mode: 'light',
      primary: { main: '#212121' },
      secondary: { main: '#616161' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
    typography: {
      fontFamily: '"IBM Plex Sans", Inter, Roboto, Helvetica, Arial, sans-serif',
      h4: { fontSize: '1.7rem', fontWeight: 600 },
      h5: { fontSize: '1.35rem', fontWeight: 600 },
      h6: { fontSize: '1rem', fontWeight: 600 },
      subtitle1: { fontSize: '0.95rem', fontWeight: 500 },
      body1: { fontSize: '0.93rem', lineHeight: 1.55, fontWeight: 400 },
      body2: { fontSize: '0.84rem', lineHeight: 1.45, fontWeight: 400 },
      button: { fontSize: '0.82rem', fontWeight: 600, textTransform: 'none' },
    },
  },
}

export function createAppTheme(stylePack: StylePack) {
  const config = packConfigs[stylePack] ?? packConfigs.enterprise

  return createTheme({
    palette: config.palette,
    shape: {
      borderRadius: config.borderRadius,
    },
    typography: config.typography,
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: config.cardVariant === 'elevation' ? config.cardElevation : 0,
        },
        styleOverrides: {
          root: {
            border: config.cardVariant === 'outlined' ? '1px solid' : 'none',
            borderColor: config.cardVariant === 'outlined' ? 'rgba(15, 23, 42, 0.16)' : 'transparent',
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          variant: config.cardVariant,
          elevation: config.cardElevation,
        },
      },
      MuiButton: {
        defaultProps: {
          size: config.buttonSize,
        },
        styleOverrides: {
          root: {
            padding: config.buttonPadding,
            borderRadius: config.borderRadius,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: config.fieldSize,
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: config.borderRadius,
          },
          input: {
            paddingTop: config.fieldPaddingY,
            paddingBottom: config.fieldPaddingY,
            paddingLeft: config.fieldPaddingX,
            paddingRight: config.fieldPaddingX,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: config.fieldSize === 'small' ? 58 : 64,
          },
        },
      },
    },
  })
}
