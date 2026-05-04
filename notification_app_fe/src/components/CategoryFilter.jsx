/**
 * ── CategoryFilter ──
 * Horizontal chip bar for filtering notifications by type.
 */

import React from 'react';
import { Stack, Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { NOTIF_CATEGORIES } from '../api/constants';
import Log from '../api/logger';
import { LOG_LEVELS, LOG_PACKAGES } from '../api/constants';

const FILTER_OPTIONS = [
  { key: '', label: 'All' },
  { key: NOTIF_CATEGORIES.EVENT, label: 'Events' },
  { key: NOTIF_CATEGORIES.RESULT, label: 'Results' },
  { key: NOTIF_CATEGORIES.PLACEMENT, label: 'Placements' },
];

export default function CategoryFilter({ active = '', onSelect }) {
  const handleSelect = (key) => {
    Log(
      'frontend',
      LOG_LEVELS.INFO,
      LOG_PACKAGES.COMPONENT,
      `Filter changed → ${key || 'All'}`,
    );
    onSelect(key);
  };

  return (
    <Stack
      id="category-filter-bar"
      direction="row"
      spacing={1}
      useFlexGap
      sx={{ flexWrap: 'wrap', alignItems: 'center' }}
    >
      <FilterListIcon sx={{ color: 'text.secondary', mr: 0.5 }} />
      {FILTER_OPTIONS.map((opt) => (
        <Chip
          key={opt.key}
          label={opt.label}
          variant={active === opt.key ? 'filled' : 'outlined'}
          color={active === opt.key ? 'primary' : 'default'}
          onClick={() => handleSelect(opt.key)}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ...(active === opt.key && {
              boxShadow: '0 2px 12px rgba(108,99,255,0.3)',
            }),
          }}
        />
      ))}
    </Stack>
  );
}
