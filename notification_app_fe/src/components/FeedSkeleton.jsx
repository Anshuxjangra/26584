/**
 * ── FeedSkeleton ──
 * Animated placeholder cards shown while notifications are loading.
 */

import React from 'react';
import { Card, CardContent, Skeleton, Stack, Box } from '@mui/material';

export default function FeedSkeleton({ count = 5 }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} sx={{ opacity: 0.55 }}>
          <CardContent>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="rounded"
                  width={95}
                  height={24}
                  sx={{ mb: 1.2, borderRadius: 2 }}
                />
                <Skeleton variant="text" width="65%" height={24} />
                <Skeleton variant="text" width="90%" height={16} sx={{ mt: 0.6 }} />
                <Skeleton variant="text" width="45%" height={16} />
              </Box>
              <Skeleton variant="text" width={110} height={16} sx={{ flexShrink: 0 }} />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
