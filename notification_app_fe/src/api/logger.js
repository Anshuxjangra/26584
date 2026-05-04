/**
 * ── In-App Logger ──
 *
 * Re-exports the same Log(stack, level, pkg, message) contract
 * used by the standalone logging_middleware, but wired with axios
 * for consistency with the rest of the React app.
 *
 * Behaviour:
 *   1. Colour-coded console mirror
 *   2. Fire-and-forget POST to /evaluation-service/logs
 *   3. Never throws — transport errors are silently swallowed
 */

import axios from 'axios';
import { ENDPOINTS, getAuthToken } from './constants';

const CONSOLE_METHOD = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
};

const LEVEL_STYLE = {
  debug: 'color:#94a3b8',
  info: 'color:#38bdf8',
  warn: 'color:#facc15;font-weight:bold',
  error: 'color:#f87171;font-weight:bold',
  fatal: 'color:#ff0000;font-weight:bold;text-decoration:underline',
};

/**
 * @param {string} stack   – always "frontend"
 * @param {string} level   – debug | info | warn | error | fatal
 * @param {string} pkg     – api | component | hook | page | state | style
 * @param {string} message – human-readable description
 */
export async function Log(stack, level, pkg, message) {
  const entry = {
    stack,
    level,
    package: pkg,
    message: message.length > 48 ? message.substring(0, 45) + '...' : message,
    timestamp: new Date().toISOString(),
  };

  // Mirror to browser console
  const method = CONSOLE_METHOD[level] || 'log';
  console[method](
    `%c[${level.toUpperCase()}] [${pkg}] ${message}`,
    LEVEL_STYLE[level] || '',
  );

  // Ship to remote — fire and forget
  try {
    const token = await getAuthToken();
    await axios.post(ENDPOINTS.LOGS, entry, {
      headers: { Authorization: token },
    });
  } catch (_) {
    console.debug('[LogTransport] Remote dispatch failed — continuing.');
  }
}

export default Log;
