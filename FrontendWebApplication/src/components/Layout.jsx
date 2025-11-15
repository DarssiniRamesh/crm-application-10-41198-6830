import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="App">
      <header className="app-header" role="banner">
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
          <button type="button" className="btn btn-small" onClick={logout} aria-label="Log out">Logout</button>
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
