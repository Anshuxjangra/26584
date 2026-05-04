/**
 * ── MUI Theme — CampusAlert ──
 * Dark, vibrant palette with Inter typography and custom component overrides.
 */

import { createTheme } from '@mui/material/styles';

const campusTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#9B94FF',
      dark: '#4A42D4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00E5A0',
      light: '#66FFCC',
      dark: '#00B37E',
      contrastText: '#0A0A0A',
    },
    background: {
      default: '#0C0E14',
      paper: '#151822',
    },
    text: {
      primary: '#E8E8F0',
      secondary: '#9CA3B0',
    },
    error: { main: '#FF6B6B' },
    warning: { main: '#FFB547' },
    success: { main: '#00E5A0' },
    divider: 'rgba(108, 99, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body2: { color: '#9CA3B0' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowY: 'overlay', // Smooth overlay scroll
        },
        '::selection': {
          backgroundColor: 'rgba(108, 99, 255, 0.3)',
          color: '#fff',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(108, 99, 255, 0.1)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(108, 99, 255, 0.18)',
            borderColor: 'rgba(108, 99, 255, 0.35)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.03em',
          fontSize: '0.72rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #6C63FF 0%, #4A42D4 100%)',
            boxShadow: '0 2px 12px rgba(108,99,255,0.35)',
          },
        },
      },
    },
  },
});

export default campusTheme;
