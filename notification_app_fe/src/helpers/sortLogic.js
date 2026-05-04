/**
 * ── Priority Engine (Stage 1 Logic) ──
 *
 * Ranks notifications using a two-key comparator:
 *   1. Category weight  →  Placement (30) > Result (20) > Event (10)
 *   2. Recency          →  Latest timestamp first within same weight
 *
 * Exported:
 *   rankByPriority(items, topN) → sorted & sliced array
 */

import { PRIORITY_WEIGHTS } from '../api/constants';

/**
 * Resolve the weight for a notification item.
 * Falls back to 0 for unknown categories.
 */
function resolveWeight(item) {
  const category = item.Type || item.notification_type || item.type || '';
  return PRIORITY_WEIGHTS[category] || 0;
}

/**
 * Parse the timestamp from whichever field the API uses.
 * Returns epoch ms or 0 if unparsable.
 */
function resolveEpoch(item) {
  const raw = item.Timestamp || item.createdAt || item.created_at || item.timestamp || item.date;
  if (!raw) return 0;
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Sort notifications by priority weight (desc) then by recency (desc),
 * and return the top N results.
 *
 * @param {Array}  items – raw notification array from the API
 * @param {number} topN  – how many to return (default 10)
 * @returns {Array} sorted, sliced result
 */
export function rankByPriority(items = [], topN = 10) {
  const sorted = [...items].sort((a, b) => {
    const weightDiff = resolveWeight(b) - resolveWeight(a);
    if (weightDiff !== 0) return weightDiff;
    return resolveEpoch(b) - resolveEpoch(a);
  });

  return sorted.slice(0, topN);
}

export default rankByPriority;
