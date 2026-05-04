/**
 * ── API Gateway ──
 * Centralised HTTP layer — all API calls go through here.
 * Keeps auth headers, error handling, and logging in one place.
 * Uses dynamic token refresh via getAuthToken().
 */

import axios from 'axios';
import { ENDPOINTS, getAuthToken, LOG_LEVELS, LOG_PACKAGES } from './constants';
import Log from './logger';

/**
 * Fetch notifications with optional query params.
 *
 * @param {{ page?: number, limit?: number, notification_type?: string }} params
 * @returns {Promise<object>} raw API response data
 */
export async function fetchNotifications(params = {}) {
  const query = {};
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.notification_type) query.notification_type = params.notification_type;

  Log(
    'frontend',
    LOG_LEVELS.INFO,
    LOG_PACKAGES.API,
    `Fetching notifications — page=${params.page || 1}, limit=${params.limit || 'default'}, type=${params.notification_type || 'all'}`,
  );

  try {
    const token = await getAuthToken();

    const res = await axios.get(ENDPOINTS.NOTIFICATIONS, {
      params: query,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    Log(
      'frontend',
      LOG_LEVELS.DEBUG,
      LOG_PACKAGES.API,
      `Notifications received — count=${Array.isArray(res.data?.notifications) ? res.data.notifications.length : Array.isArray(res.data?.data) ? res.data.data.length : '?'}`,
    );

    return res.data;
  } catch (err) {
    Log(
      'frontend',
      LOG_LEVELS.ERROR,
      LOG_PACKAGES.API,
      `Notification fetch failed: ${err.message}`,
    );
    throw err;
  }
}

export default { fetchNotifications };
