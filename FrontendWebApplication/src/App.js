import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';

import UsersList from './pages/UsersList';
import TicketsList from './pages/TicketsList';
import TicketCreate from './pages/TicketCreate';
import ComplaintsList from './pages/ComplaintsList';
import ComplaintCreate from './pages/ComplaintCreate';
import Case360 from './pages/Case360';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// PUBLIC_INTERFACE
function App() {
  /** Root app component defining routes and top-level providers.
   *  Authentication gating is disabled to allow navigation without strict sign-in.
   *  A demo login is available at /login.
   */
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Keep default landing on Users to preserve existing tests */}
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/users" element={<UsersList />} />
        <Route path="/tickets" element={<TicketsList />} />
        <Route path="/tickets/new" element={<TicketCreate />} />
        <Route path="/complaints" element={<ComplaintsList />} />
        <Route path="/complaints/new" element={<ComplaintCreate />} />
        <Route path="/case360/:caseId" element={<Case360 />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
