import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ThemedApp from './ThemedApp';
import theme from './ui/theme';
import { AuthProvider } from './context/AuthContext';
import { UiSettingsProvider } from './context/UiSettingsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <UiSettingsProvider>
            <ThemedApp />
          </UiSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
