/**
 * ── PriorityPage (Priority Notifications Page) ──
 *
 * Fetches ALL notifications (high limit, no filter), then applies
 * the priority engine to surface the top N items ranked by:
 *   1. Category weight  (Placement > Result > Event)
 *   2. Recency          (latest first within same tier)
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Stack,
  Slider,
  Box,
  Fade,
  Chip,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import { fetchNotifications } from '../api/gateway';
import { rankByPriority } from '../helpers/sortLogic';
import AlertCard from '../components/AlertCard';
import FeedSkeleton from '../components/FeedSkeleton';
import NoData from '../components/NoData';
import ErrorMessage from '../components/ErrorMessage';
import Log from '../api/logger';
import { LOG_LEVELS, LOG_PACKAGES } from '../api/constants';

export default function PriorityPage() {
  const [topN, setTopN] = useState(5);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fault, setFault] = useState(null);

  // Fetch multiple batches (one per category) to build a diverse pool for ranking.
  // API max limit is 10, so we pull 10 of each type = 30 total items.
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setFault(null);

    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.PAGE, 'PriorityPage → fetching all categories');

    try {
      const [eventsRes, resultsRes, placementsRes] = await Promise.all([
        fetchNotifications({ page: 1, limit: 10, notification_type: 'Event' }),
        fetchNotifications({ page: 1, limit: 10, notification_type: 'Result' }),
        fetchNotifications({ page: 1, limit: 10, notification_type: 'Placement' }),
      ]);

      const all = [
        ...(eventsRes?.notifications || eventsRes?.data || []),
        ...(resultsRes?.notifications || resultsRes?.data || []),
        ...(placementsRes?.notifications || placementsRes?.data || []),
      ];

      setFeed(all);
      Log('frontend', LOG_LEVELS.DEBUG, LOG_PACKAGES.PAGE, `Aggregated ${all.length} notifications for ranking`);
    } catch (err) {
      setFault(err);
      Log('frontend', LOG_LEVELS.ERROR, LOG_PACKAGES.PAGE, `Priority fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const prioritised = useMemo(() => {
    const ranked = rankByPriority(feed, topN);
    Log(
      'frontend',
      LOG_LEVELS.DEBUG,
      LOG_PACKAGES.PAGE,
      `Priority ranking applied — showing top ${ranked.length} of ${feed.length}`,
    );
    return ranked;
  }, [feed, topN]);



  const handleSliderChange = (_event, value) => {
    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.PAGE, `Top-N changed → ${value}`);
    setTopN(value);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ── Header ── */}
      <Stack spacing={0.5} mb={3}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <BoltIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              background: 'linear-gradient(90deg, #6C63FF 0%, #00E5A0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              width: 'fit-content'
            }}
          >
            Priority Feed
          </Typography>
        </Stack>
        <Typography variant="body2">
          Top notifications ranked by importance — Placements first, then Results, then Events.
          Most recent items surface higher within each tier.
        </Typography>
      </Stack>

      {/* ── Top-N Slider ── */}
      <Box
        sx={{
          mb: 4,
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid rgba(108,99,255,0.1)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Show top
          </Typography>
          <Chip
            label={topN}
            color="primary"
            size="small"
            sx={{ fontWeight: 700, minWidth: 36 }}
          />
          <Typography variant="subtitle2" color="text.secondary">
            notifications
          </Typography>
        </Stack>
        <Slider
          id="priority-topn-slider"
          value={topN}
          onChange={handleSliderChange}
          min={1}
          max={20}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
            { value: 20, label: '20' },
          ]}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-track': {
              background: 'linear-gradient(90deg, #6C63FF, #00E5A0)',
            },
          }}
        />
      </Box>

      {/* ── Priority Legend ── */}
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap mb={3}>
        <Chip label="🟢 Placement (Highest)" size="small" variant="outlined" />
        <Chip label="🟡 Result (Medium)" size="small" variant="outlined" />
        <Chip label="🟣 Event (Standard)" size="small" variant="outlined" />
      </Stack>

      {/* ── Content ── */}
      {loading && <FeedSkeleton count={topN} />}

      {!loading && fault && <ErrorMessage error={fault} onRetry={fetchAll} />}

      {!loading && !fault && prioritised.length === 0 && (
        <NoData message="No notifications to rank" />
      )}

      {!loading && !fault && prioritised.length > 0 && (
        <Fade in timeout={400}>
          <Stack spacing={2}>
            {prioritised.map((item, idx) => (
              <Box 
                key={item.ID || item._id || item.id || idx} 
                sx={{ position: 'relative' }}
              >
                {/* Rank badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: 16,
                    zIndex: 2,
                    bgcolor: idx < 3 ? 'secondary.main' : 'primary.main',
                    color: idx < 3 ? '#0A0A0A' : '#fff',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    boxShadow: `0 2px 8px ${idx < 3 ? 'rgba(0,229,160,0.4)' : 'rgba(108,99,255,0.4)'}`,
                  }}
                >
                  #{idx + 1}
                </Box>
                <AlertCard item={item} />
              </Box>
            ))}
          </Stack>
        </Fade>
      )}
    </Container>
  );
}
