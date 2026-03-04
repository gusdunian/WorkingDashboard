import {
  Box,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  AppBar as MuiAppBar,
} from '@mui/material'
import { styled, type CSSObject, type Theme } from '@mui/material/styles'
import { type PropsWithChildren, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useUiSettings } from '../context/UiSettingsContext'
import type { StylePack } from '../theme/createAppTheme'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const stylePackOptions: { label: string; value: StylePack }[] = [
  { label: 'Gmail-like', value: 'gmail' },
  { label: 'Modern SaaS', value: 'saas' },
  { label: 'Enterprise Admin', value: 'enterprise' },
  { label: 'Minimal', value: 'minimal' },
]

export default function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const { stylePack, setStylePack } = useUiSettings()
  const [open, setOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" open={open} color="inherit" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton color="inherit" aria-label="toggle drawer" onClick={() => setOpen((prev) => !prev)} edge="start">
            <Typography component="span" fontWeight={700}>{open ? '←' : '☰'}</Typography>
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Working Dashboard
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="style-pack-label">Style Pack</InputLabel>
            <Select
              labelId="style-pack-label"
              id="style-pack"
              label="Style Pack"
              value={stylePack}
              onChange={(event) => setStylePack(event.target.value as StylePack)}
            >
              {stylePackOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <StyledDrawer variant="permanent" open={open}>
        <Toolbar sx={{ justifyContent: open ? 'flex-end' : 'center' }}>
          <IconButton onClick={() => setOpen((prev) => !prev)} aria-label="collapse drawer">
            <Typography component="span" fontWeight={700}>{open ? '←' : '→'}</Typography>
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItemButton component={RouterLink} to="/" selected={location.pathname === '/'}>
            <ListItemText primary={open ? 'Home' : 'H'} />
          </ListItemButton>
          <ListItemButton component={RouterLink} to="/dashboard" selected={location.pathname === '/dashboard'}>
            <ListItemText primary={open ? 'Dashboard' : 'D'} />
          </ListItemButton>
        </List>
      </StyledDrawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}
