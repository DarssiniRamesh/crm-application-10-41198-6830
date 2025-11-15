import axios from 'axios';
import { getApiBase, getLogLevel } from '../utils/env';

let authToken = null;
const unauthorizedHandlers = new Set();

/**
 * Register a callback to be invoked when a 401 Unauthorized response is received.
 * Returns an unregister function.
 */
export function registerUnauthorizedHandler(fn) {
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
    Accept: 'application/json'
  },
  withCredentials: false
});

// Request interceptor to attach token dynamically if set
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor for error handling and 401 logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const level = getLogLevel();
    if (error?.response?.status === 401) {
      // Notify all registered handlers
      unauthorizedHandlers.forEach((h) => {
        try { h(); } catch (e) { /* noop */ }
      });
    } else if (level === 'debug' || level === 'info') {
      // eslint-disable-next-line no-console
      console.warn('API error:', error?.response?.status, error?.message);
    }
    return Promise.reject(error);
  }
);

export default api;
