/**
 * ── Central Constants ──
 * Single source of truth for API endpoints, auth, enums, and config values.
 */

export const API_ROOT = '/evaluation-service';

export const ENDPOINTS = {
  NOTIFICATIONS: `${API_ROOT}/notifications`,
  LOGS: `${API_ROOT}/logs`,
};

/** Credentials for auto-refreshing the JWT token */
export const AUTH_CREDENTIALS = {
  clientID: '88bf1133-0171-400f-bf04-0c93962e4456',
  clientSecret: 'mjRrtJCwvgWYjhwJ',
  email: 'priyanshu.26584@ggnindia.dronacharya.info',
  name: 'priyanshu',
  rollNo: '26584',
  accessCode: 'uksdWT',
};

/**
 * Token cache — stores the current JWT and its expiry.
 * getAuthToken() will refresh automatically when expired.
 */
let _cachedToken = null;
let _tokenExpiry = 0;

export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (_cachedToken && _tokenExpiry > now + 60) {
    return `Bearer ${_cachedToken}`;
  }

  // Fetch a new token
  try {
    const res = await fetch(`${API_ROOT}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(AUTH_CREDENTIALS),
    });
    const data = await res.json();

    if (data.access_token) {
      _cachedToken = data.access_token;
      _tokenExpiry = data.expires_in || now + 600; // fallback 10min
      return `Bearer ${_cachedToken}`;
    }
  } catch (_) {
    // If refresh fails, try with cached token anyway
  }

  return _cachedToken ? `Bearer ${_cachedToken}` : '';
}

/** Notification categories the API supports */
export const NOTIF_CATEGORIES = {
  EVENT: 'Event',
  RESULT: 'Result',
  PLACEMENT: 'Placement',
};

/** Priority weights — higher = more important */
export const PRIORITY_WEIGHTS = {
  [NOTIF_CATEGORIES.PLACEMENT]: 30,
  [NOTIF_CATEGORIES.RESULT]: 20,
  [NOTIF_CATEGORIES.EVENT]: 10,
};

/** Allowed log severity levels */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

/** Log origin packages */
export const LOG_PACKAGES = {
  API: 'api',
  COMPONENT: 'component',
  HOOK: 'hook',
  PAGE: 'page',
  STATE: 'state',
  STYLE: 'style',
};

/** Default pagination values */
export const PAGINATION = {
  DEFAULT_LIMIT: 5,
  DEFAULT_PAGE: 1,
};
