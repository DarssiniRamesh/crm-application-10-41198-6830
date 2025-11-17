#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * dev.js - Strict bootstrap for CRA dev server.
 *
 * Purpose:
 * - Force HOST to 0.0.0.0 so the server is reachable externally.
 * - Determine PORT from env or npm_config_port with a safe default.
 * - Protect against CLI flags being passed to the shell (we do not forward flags).
 * - Provide non-interactive behavior and avoid stalls via polling watchers.
 * - If the selected port is already in use, assume the server is already running and exit 0
 *   (per container guidance that an occupied port implies a running hot-reload server).
 *
 * Usage examples:
 *   npm run dev
 *   npm run dev -- --port 3001 (flags are intentionally ignored)
 */

const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

// Compute effective host/port with precedence:
// 1) PORT or REACT_APP_PORT
// 2) npm_config_port
// 3) default 3001
const cliPort = process.env.npm_config_port;
const envPort = process.env.PORT || process.env.REACT_APP_PORT;
const effectiveHost = '0.0.0.0';
const effectivePort = String(envPort || cliPort || '3001');

// Prepare environment for child process with safe defaults.
const childEnv = {
  ...process.env,
  HOST: effectiveHost,
  PORT: effectivePort,
  // Avoid opening a browser in headless environments
  BROWSER: process.env.BROWSER || 'none',
  // Improve reliability on file systems where native events aren't relayed
  CHOKIDAR_USEPOLLING: process.env.CHOKIDAR_USEPOLLING || 'true',
  WATCHPACK_POLLING: process.env.WATCHPACK_POLLING || 'true',
  // Keep fast refresh on
  FAST_REFRESH: process.env.FAST_REFRESH || 'true',
  // Ensure CRA doesn't treat this as strict CI (which would fail on minor warnings)
  CI: process.env.CI || 'false'
};

// Resolve react-scripts binary cross-platform.
const reactScriptsBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'react-scripts.cmd' : 'react-scripts'
);

// Start CRA dev server
function startReactScripts() {
  console.log(`Starting CRA dev server on http://${effectiveHost}:${effectivePort} ...`);
  const child = spawn(reactScriptsBin, ['start'], {
    stdio: 'inherit',
    env: childEnv,
    shell: false
  });

  child.on('error', (err) => {
    console.error('Failed to start react-scripts:', err?.message || err);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`react-scripts exited due to signal: ${signal}`);
      process.exit(1);
    }
    process.exit(code ?? 0);
  });
}

// Check whether the port is free. If occupied, assume server is already running.
function checkPortAvailable(host, port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        console.error('Port check failed:', err?.message || err);
        // On unexpected error, return false to be conservative (avoid starting duplicate servers).
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen({ host, port });
  });
}

(async () => {
  console.log(`[dev] Using HOST=${effectiveHost} PORT=${effectivePort}`);
  const free = await checkPortAvailable(effectiveHost, effectivePort);
  if (!free) {
    console.log(`[dev] Port ${effectivePort} is already in use. Assuming dev server is already running. Skipping new start.`);
    process.exit(0);
  }
  startReactScripts();
})();
