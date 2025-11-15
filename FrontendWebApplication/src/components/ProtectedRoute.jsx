import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Route guard that redirects to /login when not authenticated. */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  // Support both wrapper and outlet usage patterns
  return children || <Outlet />;
}
