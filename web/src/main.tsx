import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import { UiSettingsProvider, useUiSettings } from './context/UiSettingsContext'
import { AuthProvider } from './context/AuthContext'
import { createAppTheme } from './theme/createAppTheme'

function ThemedApp() {
  const { stylePack } = useUiSettings()
  const theme = useMemo(() => createAppTheme(stylePack), [stylePack])

  const basename = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UiSettingsProvider>
        <ThemedApp />
      </UiSettingsProvider>
    </AuthProvider>
  </StrictMode>,
)