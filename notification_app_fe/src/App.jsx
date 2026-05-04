/**
 * ── App Shell ──
 * Root component: applies MUI theme, sets up routing, renders TopNav + views.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import campusTheme from './api/theme';
import TopNav from './components/TopNav';
import AllNotifications from './pages/AllNotifications';
import PriorityPage from './pages/PriorityPage';

export default function App() {
  return (
    <ThemeProvider theme={campusTheme}>
      <CssBaseline />
      <BrowserRouter>
        <TopNav />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}
