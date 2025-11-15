import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { onConnectivityChange, pingBackend } from '../services/apiClient';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [backendStatus, setBackendStatus] = useState('unknown');

  useEffect(() => {
    const unsubscribe = onConnectivityChange(setBackendStatus);
    // Initial quick ping; ignore errors
    pingBackend(1000).catch(() => {});
    // Periodic health ping
    const id = setInterval(() => {
      pingBackend(2000).catch(() => {});
    }, 30000);
    return () => {
      unsubscribe();
      clearInterval(id);
    };
  }, []);

  return (
    <div className="App">
      <header className="app-header" role="banner">
        {backendStatus === 'down' && (
          <div
            role="alert"
            aria-live="polite"
            style={{
              background: '#fff3cd',
              color: '#664d03',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              padding: '0.5rem 1rem'
            }}
          >
            Backend is unreachable. Some data may be unavailable. We will retry automatically.
          </div>
        )}
        <nav aria-label="Primary" className="navbar">
          <div className="brand">
            <Link to="/users" className="brand-link">CRM</Link>
          </div>
          <ul className="nav-list" role="menubar" aria-label="Main menu">
            <li role="none"><Link role="menuitem" to="/users">Users</Link></li>
            <li role="none"><Link role="menuitem" to="/tickets">Tickets</Link></li>
            <li role="none"><Link role="menuitem" to="/tickets/new">New Ticket</Link></li>
            <li role="none"><Link role="menuitem" to="/complaints">Complaints</Link></li>
            <li role="none"><Link role="menuitem" to="/complaints/new">New Complaint</Link></li>
            <li role="none"><Link role="menuitem" to="/reports">Reports</Link></li>
            <li role="none"><Link role="menuitem" to="/notifications">Notifications</Link></li>
          </ul>

          <div aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <>
                <span title="Signed-in user">
                  Signed in as <strong>{user?.displayName || user?.username || 'User'}</strong>
                </span>
                <button type="button" className="btn btn-small" onClick={logout} aria-label="Log out">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-small" aria-label="Go to login">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex="-1" role="main" className="container">
        <Outlet />
      </main>
      <footer className="app-footer" role="contentinfo">
        <small>&copy; {new Date().getFullYear()} CRM Application</small>
      </footer>
    </div>
  );
}
