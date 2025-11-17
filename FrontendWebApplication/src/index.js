import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initHealthMonitor } from './services/apiClient';

/* Log mounting origin to aid diagnostics in CI readiness checks */
if (typeof window !== 'undefined' && window?.location?.origin) {
  // eslint-disable-next-line no-console
  console.info(`[startup] CRA app mounting at ${window.location.origin}`);
}

// Start lightweight health monitor with retry/backoff.
// This will keep the connectivity banner in sync and avoid mixed-content/CORS issues.
try {
  initHealthMonitor();
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Health monitor init failed:', e?.message || e);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
