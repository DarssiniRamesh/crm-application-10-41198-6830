 // PUBLIC_INTERFACE
 /**
  * getApiBase returns the base URL for API requests.
  *
  * NOTE: Hardcoded per operations request to eliminate configuration drift.
  * Environment variables and window-origin fallbacks are intentionally ignored.
  */
export function getApiBase() {
  return 'https://vscode-internal-29664-beta.beta01.cloud.kavia.ai:3000';
}

// PUBLIC_INTERFACE
/**
 * getFrontendBase returns the public base URL of this SPA for OAuth2 redirects.
 */
export function getFrontendBase() {
  return (process.env.REACT_APP_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, '');
}

// PUBLIC_INTERFACE
/**
 * getLogLevel returns the log level string.
 */
export function getLogLevel() {
  return process.env.REACT_APP_LOG_LEVEL || 'info';
}
