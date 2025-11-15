import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken, registerUnauthorizedHandler } from '../services/apiClient';
import { getApiBase, getFrontendBase } from '../utils/env';

const AuthContext = createContext(null);
const LS_TOKEN_KEY = 'crm_auth_token';
const LS_USER_KEY = 'crm_auth_user';

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth context: { token, user, isAuthenticated, login, logout, beginOAuth2 } */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provide authentication state and actions to the app.
   *  Implements a permissive demo login that accepts any non-empty credentials and sets a dummy token.
   */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!token;

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? window.localStorage.getItem(LS_TOKEN_KEY) : null;
    const savedUserStr = typeof window !== 'undefined' ? window.localStorage.getItem(LS_USER_KEY) : null;
    const savedUser = savedUserStr ? safeParse(savedUserStr) : null;

    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
    } else {
      setAuthToken(null);
    }
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Global 401 handler; in dev/test do not redirect automatically
  useEffect(() => {
    const unregister = registerUnauthorizedHandler(() => {
      // Clear token on unauthorized
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LS_TOKEN_KEY);
        window.localStorage.removeItem(LS_USER_KEY);
      }
      setToken(null);
      setUser(null);
      setAuthToken(null);

      const env = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV;
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
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(async (username, password) => {
    /** Permissive demo login: accepts any non-empty credentials, sets a dummy token and user, and proceeds. */
    if (!username || !password) {
      const err = new Error('Username and password are required.');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    const demoToken = 'demo-token';
    const demoUser = {
      username,
      email: `${String(username).replace(/\s+/g, '').toLowerCase()}@demo.local`,
      roles: ['demo'],
      displayName: username
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LS_TOKEN_KEY, demoToken);
      window.localStorage.setItem(LS_USER_KEY, JSON.stringify(demoUser));
    }
    setToken(demoToken);
    setUser(demoUser);
    setAuthToken(demoToken);
    return true;
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    /** Clear demo token and user and reset state. */
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LS_TOKEN_KEY);
      window.localStorage.removeItem(LS_USER_KEY);
    }
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  // PUBLIC_INTERFACE
  const beginOAuth2 = useCallback(() => {
    /** Initiate OAuth2 authorization flow (stub). */
    const frontend = getFrontendBase();
    const apiBase = getApiBase();
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
    user,
    isAuthenticated,
    login,
    logout,
    beginOAuth2
  }), [token, user, isAuthenticated, login, logout, beginOAuth2]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return null;
  }
}
