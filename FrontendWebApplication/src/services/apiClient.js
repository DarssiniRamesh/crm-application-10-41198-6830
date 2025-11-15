import axios from 'axios';
import { getApiBase, getLogLevel } from '../utils/env';

let authToken = null;
const unauthorizedHandlers = new Set();

// Track backend connectivity status and provide subscription utilities.
let connectivityStatus = 'unknown'; // 'up' | 'down' | 'unknown'
const connectivityListeners = new Set();

function notifyConnectivity(nextStatus) {
  if (connectivityStatus !== nextStatus) {
    connectivityStatus = nextStatus;
    connectivityListeners.forEach((fn) => {
      try { fn(connectivityStatus); } catch (_) { /* noop */ }
    });
  }
}

// PUBLIC_INTERFACE
export function registerUnauthorizedHandler(fn) {
  /** Register a callback to be invoked when a 401 Unauthorized response is received. Returns an unregister function. */
  unauthorizedHandlers.add(fn);
  return () => unauthorizedHandlers.delete(fn);
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Set the bearer token used in Authorization header, or clear it when falsy. */
  authToken = token || null;
  if (authToken) {
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

const api = axios.create({
  baseURL: getApiBase(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  // Unless backend cookies are explicitly required, keep this false to avoid CORS complications.
  withCredentials: false,
  // Reasonable timeout to avoid hanging in UI
  timeout: 15000
});

// PUBLIC_INTERFACE
export function onConnectivityChange(handler) {
  /** Subscribe to backend connectivity changes ('up' | 'down' | 'unknown').
   *  The handler is invoked immediately with the current status.
   *  Returns an unsubscribe function.
   */
  connectivityListeners.add(handler);
  try { handler(connectivityStatus); } catch (_) { /* noop */ }
  return () => connectivityListeners.delete(handler);
}

// PUBLIC_INTERFACE
export async function pingBackend(timeoutMs = 3000) {
  /** Pings the backend to determine reachability. Returns true if reachable, false otherwise. */
  try {
    await api.get('/users', {
      params: { page: 1, pageSize: 1 },
      headers: { 'Cache-Control': 'no-cache' },
      timeout: timeoutMs
    });
    notifyConnectivity('up');
    return true;
  } catch (_) {
    notifyConnectivity('down');
    return false;
  }
}

// PUBLIC_INTERFACE
export function getConnectivityStatus() {
  /** Returns the last known backend connectivity status: 'up', 'down', or 'unknown'. */
  return connectivityStatus;
}

// Attach token dynamically for every request
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Centralized response and error handling
api.interceptors.response.use(
  (response) => {
    // Any successful response implies backend is up
    notifyConnectivity('up');
    return response;
  },
  (error) => {
    const logLevel = getLogLevel();
    const env = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV;

    const hasResponse = !!error?.response;
    const status = error?.response?.status;

    // Provide friendly messages for network or server errors
    let friendlyMessage = error?.response?.data?.message || error?.message || 'Request failed';
    if (!hasResponse || status === 0) {
      friendlyMessage = 'Unable to reach backend service. Please check your connection or try again shortly.';
      notifyConnectivity('down');
    } else if (status >= 500) {
      friendlyMessage = 'Server error. Please try again later.';
    }

    error.friendlyMessage = friendlyMessage;
    try {
      if (friendlyMessage && friendlyMessage !== error.message) {
        // Ensure UI displays a clear message via existing .message usage in pages
        error.message = friendlyMessage;
      }
    } catch (_) { /* noop */ }

    if (status === 401) {
      if (env === 'production') {
        // Production: enforce auth clearing/redirect via registered handlers
        unauthorizedHandlers.forEach((h) => {
          try { h(); } catch (_) { /* noop */ }
        });
      } else if (logLevel === 'debug' || logLevel === 'info') {
        // eslint-disable-next-line no-console
        console.info('API 401 received in dev/test; skipping auto-redirect.');
      }
    } else if (logLevel === 'debug' || logLevel === 'info') {
      // eslint-disable-next-line no-console
      console.warn('API error:', status, error?.friendlyMessage || error?.message);
    }

    return Promise.reject(error);
  }
);

export default api;
