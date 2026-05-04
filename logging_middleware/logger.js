/**
 * ──────────────────────────────────────────────
 *  Logging Middleware — Standalone Module
 * ──────────────────────────────────────────────
 *
 *  Signature:  Log(stack, level, pkg, message)
 *
 *  Parameters:
 *    stack   → always "frontend"
 *    level   → debug | info | warn | error | fatal
 *    pkg     → api | component | hook | page | state | style
 *    message → human-readable description of what happened
 *
 *  Behaviour:
 *    1. Builds a structured log entry with a UTC timestamp
 *    2. Mirrors the entry to the browser console (colour-coded)
 *    3. Ships the entry to POST /evaluation-service/logs
 *    4. Never throws — log transport failures are swallowed silently
 *       so that logging can never break the user-facing application
 */

const LOG_ENDPOINT = 'http://20.207.122.201/evaluation-service/logs';

const AUTH_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwcml5YW5zaHUuMjY1ODRAZ2duaW5kaWEuZHJvbmFjaGFyeWEuaW5mbyIsImV4cCI6MTc3Nzg3MzE0NywiaWF0IjoxNzc3ODcyMjQ3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGM5YzI2ODQtMjA2NS00NGIyLWE3MGEtMzFlNjJmMmQzZGNjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHJpeWFuc2h1Iiwic3ViIjoiODhiZjExMzMtMDE3MS00MDBmLWJmMDQtMGM5Mzk2MmU0NDU2In0sImVtYWlsIjoicHJpeWFuc2h1LjI2NTg0QGdnbmluZGlhLmRyb25hY2hhcnlhLmluZm8iLCJuYW1lIjoicHJpeWFuc2h1Iiwicm9sbE5vIjoiMjY1ODQiLCJhY2Nlc3NDb2RlIjoidWtzZFdUIiwiY2xpZW50SUQiOiI4OGJmMTEzMy0wMTcxLTQwMGYtYmYwNC0wYzkzOTYyZTQ0NTYiLCJjbGllbnRTZWNyZXQiOiJtalJydEpDd3ZnV1lqaHdKIn0.A4upY73mRilHsSIL4TQrMSNVKYL4JlMC-3jf54ynPOw';

// Console method mapping for each severity level
const CONSOLE_METHOD = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error', // browsers don't have console.fatal
};

// Colour badges per level (for browser console styling)
const LEVEL_STYLE = {
  debug: 'color:#94a3b8;font-weight:normal',
  info: 'color:#38bdf8;font-weight:normal',
  warn: 'color:#facc15;font-weight:bold',
  error: 'color:#f87171;font-weight:bold',
  fatal: 'color:#ff0000;font-weight:bold;text-decoration:underline',
};

/**
 * Main logging function — fire-and-forget.
 *
 * @param {string} stack   - Origin stack (always "frontend")
 * @param {string} level   - Severity: debug | info | warn | error | fatal
 * @param {string} pkg     - Package origin: api | component | hook | page | state | style
 * @param {string} message - Human-readable log message
 */
async function Log(stack, level, pkg, message) {
  const entry = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString(),
  };

  // ── 1. Mirror to browser console ──
  const method = CONSOLE_METHOD[level] || 'log';
  const style = LEVEL_STYLE[level] || '';
  console[method](
    `%c[${level.toUpperCase()}] [${pkg}] ${message}`,
    style,
  );

  // ── 2. Ship to remote endpoint ──
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTH_TOKEN,
      },
      body: JSON.stringify(entry),
    });
  } catch (_err) {
    // Silently swallow — log transport must never crash the app
    console.debug('[LogTransport] Remote dispatch failed — continuing.');
  }
}

export default Log;
