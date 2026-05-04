/**
 * ── useNotificationFeed ──
 * Custom hook for fetching, caching, and managing notification data.
 *
 * Returns:
 *   feed       – array of notification objects
 *   loading    – boolean, true while fetching
 *   fault      – error object or null
 *   totalPages – total pages from the API response
 *   refresh()  – manually re-trigger the fetch
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchNotifications } from '../api/gateway';
import Log from '../api/logger';
import { LOG_LEVELS, LOG_PACKAGES, PAGINATION } from '../api/constants';

export default function useNotificationFeed({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  notificationType = '',
} = {}) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fault, setFault] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const mountedRef = useRef(true);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setFault(null);

    Log('frontend', LOG_LEVELS.INFO, LOG_PACKAGES.HOOK, 'useNotificationFeed → initiating fetch');

    try {
      const query = { page, limit };
      if (notificationType) query.notification_type = notificationType;

      const result = await fetchNotifications(query);

      if (!mountedRef.current) return;

      // Normalise — the API may wrap data in different shapes
      const items = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.notifications)
          ? result.notifications
          : Array.isArray(result)
            ? result
            : [];

      setFeed(items);

      // Resolve total pages from whichever field the API provides
      const pages =
        result?.totalPages ||
        result?.total_pages ||
        Math.ceil((result?.total || result?.totalCount || items.length) / limit) ||
        1;
      setTotalPages(pages);

      Log(
        'frontend',
        LOG_LEVELS.DEBUG,
        LOG_PACKAGES.HOOK,
        `Feed loaded — ${items.length} items, ${pages} total pages`,
      );
    } catch (err) {
      if (!mountedRef.current) return;
      setFault(err);
      Log('frontend', LOG_LEVELS.ERROR, LOG_PACKAGES.HOOK, `Feed fetch failed: ${err.message}`);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [page, limit, notificationType]);

  useEffect(() => {
    mountedRef.current = true;
    fetchFeed();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchFeed]);

  return { feed, loading, fault, totalPages, refresh: fetchFeed };
}
