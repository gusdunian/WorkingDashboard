import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import { UiSettingsProvider, useUiSettings } from './context/UiSettingsContext'
import { createAppTheme } from './theme/createAppTheme'

function ThemedApp() {
  const { stylePack } = useUiSettings()
  const theme = useMemo(() => createAppTheme(stylePack), [stylePack])

  // Dev should run at "/" in Codespaces/local.
  // Prod should respect Vite base (e.g. "/WorkingDashboard/react/") for GitHub Pages.
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
    <UiSettingsProvider>
      <ThemedApp />
    </UiSettingsProvider>
  </StrictMode>,
)