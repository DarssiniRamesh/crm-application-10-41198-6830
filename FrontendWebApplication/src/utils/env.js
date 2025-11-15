 // PUBLIC_INTERFACE
 /**
  * getApiBase returns the base URL for API requests.
  * Resolution order:
  * 1. REACT_APP_API_BASE
  * 2. REACT_APP_BACKEND_URL
  * 3. window.location.origin + '/api/v1'
  */
export function getApiBase() {
  const fromEnv = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (fromEnv && typeof fromEnv === 'string') {
    return fromEnv.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin.replace(/\/+$/, '')}/api/v1`;
  }
  // Safe final fallback
  return '/api/v1';
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
