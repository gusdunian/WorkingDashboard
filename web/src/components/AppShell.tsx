import { FormEvent, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, signInWithPassword, signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPassword('');
    setErrorMessage('');
  };

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signInWithPassword(email, password);
      handleCloseDialog();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/dashboard" color="inherit">
              React Dashboard
            </Button>
            <Button component={RouterLink} to="/legacy" color="inherit">
              Legacy Dashboard
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Button size="small" color="error" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button size="small" variant="contained" onClick={() => setDialogOpen(true)}>
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>{children}</Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleSignIn}>
          <DialogTitle>Sign in</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
            />
            {errorMessage ? (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Submit'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
