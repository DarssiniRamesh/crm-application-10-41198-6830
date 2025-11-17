"use strict";

/**
 * PUBLIC_INTERFACE
 * setupProxy - Adds health endpoints to CRA dev server so readiness probes succeed.
 *
 * This function is loaded by react-scripts (development server) at startup.
 * We register lightweight handlers to return 200 OK for /health and /healthz.
 * Note: We intentionally do not add any proxying here to keep it lightweight.
 *
 * References:
 * - https://create-react-app.dev/docs/proxying-api-requests-in-development/
 *
 * Returns: void
 */
module.exports = function setupProxy(app) {
  // Log effective host/port at dev server bootstrap for readiness diagnostics
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 'unknown';
  // eslint-disable-next-line no-console
  console.log(`[setupProxy] Health endpoints registered. HOST=${host} PORT=${port}`);

  // Liveness and readiness endpoints for container orchestration
  app.get("/health", (_req, res) => {
    res.status(200).type("text/plain").send("ok");
  });
  app.get("/healthz", (_req, res) => {
    res.status(200).type("text/plain").send("ok");
  });

  // Support HEAD requests as well
  app.head("/health", (_req, res) => res.status(200).end());
  app.head("/healthz", (_req, res) => res.status(200).end());
};
