import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
/* Log mounting origin to aid diagnostics in CI readiness checks */
if (typeof window !== 'undefined' && window?.location?.origin) {
  // eslint-disable-next-line no-console
  console.info(`[startup] CRA app mounting at ${window.location.origin}`);
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
