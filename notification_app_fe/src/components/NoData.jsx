/**
 * ── NoData ──
 * Friendly empty-state shown when no notifications match the current filter.
 */

import React from 'react';
import { Stack, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export default function NoData({ message = 'No notifications found' }) {
  return (
    <Stack
      id="empty-slate"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ py: 10, opacity: 0.65 }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 68, color: 'text.secondary' }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 360, textAlign: 'center' }}
      >
        When new campus alerts arrive, they will appear here.
      </Typography>
    </Stack>
  );
}
