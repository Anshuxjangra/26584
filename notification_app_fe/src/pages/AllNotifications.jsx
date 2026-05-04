/**
 * ── AllNotifications (All Notifications Page) ──
 *
 * Features:
 *   • Category filter chips
 *   • Paginated notification list
 *   • Loading / Error / Empty states
 *   • Unread highlight via AlertCard
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stack,
  Pagination,
  Box,
  Fade,
} from '@mui/material';
import useNotificationFeed from '../hooks/useNotificationFeed';
import AlertCard from '../components/AlertCard';
import CategoryFilter from '../components/CategoryFilter';
import FeedSkeleton from '../components/FeedSkeleton';
import NoData from '../components/NoData';
import ErrorMessage from '../components/ErrorMessage';
import Log from '../api/logger';
import { LOG_LEVELS, LOG_PACKAGES, PAGINATION } from '../api/constants';

export default function AllNotifications() {
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [activeFilter, setActiveFilter] = useState('');

  const { feed, loading, fault, totalPages, refresh } = useNotificationFeed({
    page: currentPage,
    limit: PAGINATION.DEFAULT_LIMIT,
    notificationType: activeFilter,
  });

  // Log page load
  useEffect(() => {
    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.PAGE, 'AllNotifications mounted');
  }, []);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handlePageChange = (_event, page) => {
    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.PAGE, `Page changed → ${page}`);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ── Header ── */}
      <Stack spacing={0.5} mb={3}>
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
          All Notifications
        </Typography>
        <Typography variant="body2">
          Browse every campus alert — filter by type, flip through pages.
        </Typography>
      </Stack>

      {/* ── Filter bar ── */}
      <Box sx={{ mb: 3 }}>
        <CategoryFilter active={activeFilter} onSelect={handleFilterChange} />
      </Box>

      {/* ── Content ── */}
      {loading && <FeedSkeleton count={6} />}

      {!loading && fault && <ErrorMessage error={fault} onRetry={refresh} />}

      {!loading && !fault && feed.length === 0 && (
        <NoData
          message={
            activeFilter
              ? `No "${activeFilter}" notifications found`
              : 'No notifications yet'
          }
        />
      )}

      {!loading && !fault && feed.length > 0 && (
        <Fade in timeout={400}>
          <Stack spacing={2}>
            {feed.map((item, idx) => (
              <AlertCard key={item.ID || item._id || item.id || idx} item={item} />
            ))}
          </Stack>
        </Fade>
      )}

      {/* ── Pagination ── */}
      {!loading && !fault && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            id="bulletin-pagination"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
