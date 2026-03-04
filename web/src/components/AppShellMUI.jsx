import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 260;

export default function AppShellMUI({
  pages,
  currentPage,
  onNavigate,
  sidebarCollapsed,
  setSidebarCollapsed,
  sidebarPosition = 'left',
  headerRight,
  children,
}) {
  const drawerWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const isRight = sidebarPosition === 'right';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          bgcolor: 'background.paper',
          width: `calc(100% - ${drawerWidth}px)`,
          ...(isRight ? { right: drawerWidth, left: 0 } : { left: drawerWidth, right: 0 }),
          transition: (theme) =>
            theme.transitions.create(['width', 'left', 'right'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shortest,
            }),
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" component="h1">
              Working Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>{headerRight}</Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor={sidebarPosition}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            bgcolor: 'background.paper',
            borderRight: !isRight ? 1 : 0,
            borderLeft: isRight ? 1 : 0,
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-end', p: 1 }}>
          <IconButton onClick={() => setSidebarCollapsed((prev) => !prev)}>
            {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {pages.map((page) => (
            <ListItemButton
              key={page.id}
              selected={currentPage === page.id}
              onClick={() => onNavigate(page.id)}
              sx={{
                minHeight: 48,
                justifyContent: sidebarCollapsed ? 'center' : 'initial',
                px: 2,
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarCollapsed ? 0 : 1.5,
                  justifyContent: 'center',
                }}
              >
                {page.icon}
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary={page.label} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(isRight ? { mr: `${drawerWidth}px` } : { ml: `${drawerWidth}px` }),
          mt: 8,
          p: 3,
          transition: (theme) =>
            theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shortest,
            }),
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
