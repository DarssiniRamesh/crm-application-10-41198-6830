 // PUBLIC_INTERFACE
 /**
  * getApiBase returns the base URL for API requests.
  *
  * Resolution order:
  * 1) REACT_APP_BACKEND_URL (must be absolute) if provided.
  * 2) window.location-derived same-host URL with backend at port 3002 and path /api/v1
  * 3) Default fallback: https://vscode-internal-40318-beta.beta01.cloud.kavia.ai:3002/api/v1
  *
  * The value returned will not have a trailing slash.
  */
export function getApiBase() {
  const sanitize = (u) => String(u || '').replace(/\/*$/, '');
  const envUrl = (process.env.REACT_APP_BACKEND_URL || '').trim();
  if (envUrl) {
    return sanitize(envUrl);
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    try {
      const current = new URL(window.location.href);
      const backend = new URL(current.origin);
      // Ensure protocol consistency to avoid mixed content
      backend.protocol = current.protocol === 'http:' ? 'http:' : 'https:';
      // Use backend port 3002 on same host
      backend.port = '3002';
      const derived = `${backend.origin}/api/v1`;
      return sanitize(derived);
    } catch (_) {
      // fall through to default
    }
  }

  // Default hardcoded fallback
  return sanitize('https://vscode-internal-40318-beta.beta01.cloud.kavia.ai:3002/api/v1');
}

// PUBLIC_INTERFACE
/**
 * getFrontendBase returns the public base URL of this SPA for OAuth2 redirects.
 */
export function getFrontendBase() {
  return (process.env.REACT_APP_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/*$/, '');
}

// PUBLIC_INTERFACE
/**
 * getLogLevel returns the log level string.
 */
export function getLogLevel() {
  return process.env.REACT_APP_LOG_LEVEL || 'info';
}
