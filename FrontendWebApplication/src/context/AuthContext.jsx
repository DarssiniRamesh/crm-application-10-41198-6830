import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken, registerUnauthorizedHandler } from '../services/apiClient';
import { getApiBase, getFrontendBase } from '../utils/env';

const AuthContext = createContext(null);
const LS_KEY = 'crm_auth_token';

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth context: { token, isAuthenticated, login, logout, beginOAuth2 } */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provide authentication state and actions to the app.
   *  In non-production environments, authentication is relaxed to allow navigation without strict sign-in.
   */
  const [token, setToken] = useState(null);
  const env = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV;
  const isDev = env !== 'production';
  const isAuthenticated = isDev || !!token;

  // Initialize from localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
    if (saved) {
      setToken(saved);
      setAuthToken(saved);
    } else {
      setAuthToken(null);
    }
  }, []);

  // Register global 401 handler; in dev/test do not redirect to login
  useEffect(() => {
    const unregister = registerUnauthorizedHandler(() => {
      // Clear token on unauthorized
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LS_KEY);
      }
      setToken(null);
      setAuthToken(null);

      // Only enforce redirect-to-login in production
      if (env === 'production' && typeof window !== 'undefined') {
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      } else {
        // eslint-disable-next-line no-console
        console.info('401 detected (dev/test): token cleared, staying on current page');
      }
    });
    return unregister;
  }, [env]);

  // PUBLIC_INTERFACE
  const login = useCallback(async (username, password) => {
    /** Authenticate against /login and persist JWT (production use-case). */
    const res = await api.post('/login', { username, password });
    const received = res?.data?.token || res?.data?.access_token || res?.data?.jwt;
    if (!received) {
      throw new Error('No token returned by server');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LS_KEY, received);
    }
    setToken(received);
    setAuthToken(received);
    return true;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /** Clear JWT and reset state. In dev/test, UI remains accessible due to relaxed auth. */
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LS_KEY);
    }
    setToken(null);
    setAuthToken(null);
  }, []);

  // PUBLIC_INTERFACE
  const beginOAuth2 = useCallback(() => {
    /** Initiate OAuth2 authorization flow (stub). */
    const frontend = getFrontendBase();
    const apiBase = getApiBase();
    // This is a stub initiation to be wired with the real backend OAuth proxy path if needed.
    const redirectUri = `${frontend}/oauth2/callback`;
    try {
      const url = `${apiBase}/oauth2/authorize?redirect_uri=${encodeURIComponent(redirectUri)}`;
      // eslint-disable-next-line no-console
      console.info('OAuth2 initiation stub - redirecting to:', url);
      if (typeof window !== 'undefined') {
        window.location.assign(url);
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('OAuth2 initiation is not configured. Please contact the administrator.');
    }
  }, []);

  const value = useMemo(() => ({
    token,
    isAuthenticated,
    login,
    logout,
    beginOAuth2
  }), [token, isAuthenticated, login, logout, beginOAuth2]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
