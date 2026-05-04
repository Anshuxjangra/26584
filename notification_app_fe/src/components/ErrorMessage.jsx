/**
 * ── ErrorMessage ──
 * Error alert with optional retry button.
 */

import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

export default function ErrorMessage({ error, onRetry }) {
  const msg =
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong while loading notifications.';

  return (
    <Box id="fault-banner" sx={{ my: 3 }}>
      <Alert
        severity="error"
        variant="outlined"
        action={
          onRetry ? (
            <Button
              color="inherit"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          ) : null
        }
      >
        <AlertTitle>Fetch Error</AlertTitle>
        {msg}
      </Alert>
    </Box>
  );
}
