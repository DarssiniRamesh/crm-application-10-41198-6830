import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { onConnectivityChange, pingBackend } from '../services/apiClient';

// PUBLIC_INTERFACE
export default function Layout() {
  /** App shell providing top header (search/profile) and a responsive left sidebar.
   *  - Sidebar includes primary navigation.
   *  - Mobile: sidebar is collapsible via a hamburger toggle.
   *  - Accessibility: proper roles, focus states, and keyboard navigation.
   */
  const { user, isAuthenticated, logout } = useAuth();
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onConnectivityChange(setBackendStatus);
    // Initial quick ping; ignore errors
    pingBackend(1000).catch(() => {});
    const id = setInterval(() => {
      pingBackend(2000).catch(() => {});
    }, 30000);
    return () => {
      unsubscribe();
      clearInterval(id);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/tickets', label: 'Tickets' },
    { to: '/complaints', label: 'Complaints' },
    { to: '/reports', label: 'Reports' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/settings', label: 'Settings' }
  ];

  return (
    <div className={`App ${sidebarOpen ? 'has-sidebar-open' : ''}`}>
      <header className="app-header" role="banner">
        {backendStatus === 'down' && (
          <div
            role="alert"
            aria-live="polite"
            className="banner-warning"
          >
            Backend is unreachable. Some data may be unavailable. We will retry automatically.
          </div>
        )}
        <div className="header-inner">
          <button
            type="button"
            className="sidebar-toggle btn btn-secondary"
            aria-label="Toggle sidebar navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰
          </button>

          <Link to="/users" className="brand-link">CRM</Link>

          <form
            className="header-search"
            role="search"
            aria-label="Global search"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="global-search">Search</label>
            <input
              id="global-search"
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <div className="header-actions" aria-live="polite">
            <span className={`status-dot ${backendStatus}`} title={`Backend: ${backendStatus}`} aria-label={`Backend status: ${backendStatus}`} />
            {isAuthenticated ? (
              <>
                <span title="Signed-in user" className="user-pill">
                  {user?.displayName || user?.username || 'User'}
                </span>
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={logout}
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-small" aria-label="Go to login">Login</Link>
            )}
          </div>
        </div>
      </header>

      <div className="app-shell">
        <aside
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          aria-label="Sidebar navigation"
        >
          <div className="sidebar-header">
            <span className="sidebar-title">Navigation</span>
          </div>
          <nav className="sidebar-nav" aria-label="Primary">
            <ul>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  >
                    <span className="link-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="app-content">
          <main id="main-content" tabIndex="-1" role="main" className="app-main container">
            <Outlet />
          </main>
          <footer className="app-footer" role="contentinfo">
            <small>&copy; {new Date().getFullYear()} CRM Application</small>
          </footer>
        </div>
      </div>
    </div>
  );
}
