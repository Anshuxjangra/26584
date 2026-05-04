/**
 * ── AlertCard ──
 * Renders a single notification with category badge, timestamp,
 * unread glow indicator, and hover micro-animation.
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SchoolIcon from '@mui/icons-material/School';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/** Visual metadata per category */
const CATEGORY_VISUALS = {
  Event: {
    icon: <EventNoteIcon fontSize="small" />,
    accent: '#6C63FF',
    bgTint: 'rgba(108, 99, 255, 0.12)',
  },
  Result: {
    icon: <SchoolIcon fontSize="small" />,
    accent: '#FFB547',
    bgTint: 'rgba(255, 181, 71, 0.12)',
  },
  Placement: {
    icon: <WorkOutlinedIcon fontSize="small" />,
    accent: '#00E5A0',
    bgTint: 'rgba(0, 229, 160, 0.12)',
  },
};

/** Format a raw ISO / date string to a human-friendly form */
function humanTime(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AlertCard({ item = {} }) {
  const category = item.Type || item.notification_type || item.type || 'Event';
  const vis = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.Event;
  const unread = item.read === false || item.is_read === false;
  const heading = item.title || item.heading || item.Message || 'Untitled Notification';
  const body = item.Message || item.message || item.description || item.body || '';
  const timeRaw = item.Timestamp || item.createdAt || item.created_at || item.timestamp || item.date;

  return (
    <Card
      id={`alert-card-${item.ID || item._id || item.id || ''}`}
      sx={{
        position: 'relative',
        overflow: 'visible',
        animation: 'slideUp 0.4s ease-out forwards',
        opacity: 0,
        '@keyframes slideUp': {
          '0%': { opacity: 0, transform: 'translateY(15px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        borderLeft: unread
          ? `4px solid ${vis.accent}`
          : '4px solid transparent',
        ...(unread && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 16,
            left: -14,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: vis.accent,
            boxShadow: `0 0 10px ${vis.accent}`,
            animation: 'pulse-dot 2s infinite',
          },
          '@keyframes pulse-dot': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.5, transform: 'scale(1.4)' },
          },
        }),
      }}
    >
      <CardContent sx={{ py: 2.5, px: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
          spacing={1.5}
        >
          {/* Left — content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.8}>
              <Chip
                icon={vis.icon}
                label={category}
                size="small"
                sx={{
                  bgcolor: vis.bgTint,
                  color: vis.accent,
                  '& .MuiChip-icon': { color: vis.accent },
                }}
              />
              {unread && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,107,107,0.12)',
                    color: '#FF6B6B',
                    fontSize: '0.62rem',
                    height: 20,
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, lineHeight: 1.4, mb: 0.4 }}
            >
              {heading}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {body}
            </Typography>
          </Box>

          {/* Right — timestamp */}
          {timeRaw && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ flexShrink: 0, pt: { xs: 0, sm: 0.5 } }}
            >
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {humanTime(timeRaw)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
