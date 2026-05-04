/**
 * ── TopNav ──
 * Sticky header with gradient brand name, desktop nav buttons, and mobile drawer.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import MenuIcon from '@mui/icons-material/Menu';
import Log from '../api/logger';
import { LOG_LEVELS, LOG_PACKAGES } from '../api/constants';

const NAV_LINKS = [
  { path: '/', label: 'All Alerts', icon: <ListAltIcon /> },
  { path: '/priority', label: 'Priority', icon: <PriorityHighIcon /> },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const goTo = (path) => {
    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.COMPONENT, `Navigating → ${path}`);
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(12, 14, 20, 0.82)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(108, 99, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          {/* ── Brand ── */}
          <Stack
            direction="row"
            spacing={1.2}
            sx={{ alignItems: 'center', flexGrow: 1, cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.02)' }, '&:active': { transform: 'scale(0.98)' } }}
            onClick={() => goTo('/')}
          >
            <NotificationsActiveIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6C63FF 0%, #00E5A0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                userSelect: 'none',
              }}
            >
              CampusAlert
            </Typography>
          </Stack>

          {/* ── Desktop links ── */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.path}
                  startIcon={link.icon}
                  onClick={() => goTo(link.path)}
                  variant={pathname === link.path ? 'contained' : 'text'}
                  size="small"
                  sx={{
                    color: pathname === link.path ? undefined : 'text.secondary',
                    ...(pathname === link.path && {
                      boxShadow: '0 2px 16px rgba(108,99,255,0.35)',
                    }),
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* ── Mobile drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: 'background.paper', width: 260 } }}
      >
        <Box sx={{ pt: 3 }}>
          <Typography variant="h6" sx={{ px: 3, mb: 2, fontWeight: 700 }}>
            Menu
          </Typography>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  selected={pathname === link.path}
                  onClick={() => goTo(link.path)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
