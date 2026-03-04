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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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
