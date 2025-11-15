import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, beginOAuth2 } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/users';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    try {
      setSubmitting(true);
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" aria-live="polite">
      <h1>Sign in</h1>
      <form onSubmit={onSubmit} aria-label="Login form">
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
          />
        </div>
        {error && (
          <div role="alert" style={{ color: 'crimson', marginBottom: '0.5rem' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn" disabled={submitting} aria-label="Sign in">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={beginOAuth2} aria-label="Sign in with OAuth2">
            Sign in with OAuth2
          </button>
        </div>
      </form>
    </div>
  );
}
