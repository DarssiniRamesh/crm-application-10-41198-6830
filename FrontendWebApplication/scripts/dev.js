#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * dev.js - Strict bootstrap for CRA dev server.
 *
 * Purpose:
 * - Force HOST to 0.0.0.0 so the server is reachable externally.
 * - Set PORT from npm_config_port if provided; otherwise default to 3001.
 * - Swallow any trailing CLI flags and invoke react-scripts start via Node's child_process API,
 *   so the shell never receives those flags (prevents "Illegal option --" errors) and CRA won't
 *   change host/port unexpectedly.
 *
 * Usage examples:
 *   npm run dev
 *   npm run dev -- --port 3001 --host 0.0.0.0  (flags are ignored by the shell; port honored only if npm_config_port is set)
 */

const { spawn } = require('node:child_process');
const path = require('node:path');

// Read port from npm config if provided. We intentionally ignore HOST flags and any other CLI arguments.
const npmPort = process.env.npm_config_port;

// Enforce binding to all interfaces; default port is 3001 unless npm_config_port is provided.
const effectiveHost = '0.0.0.0';
const effectivePort = npmPort || '3001';

// Prepare environment for child process. These override any existing PORT/HOST from parent env.
const childEnv = {
  ...process.env,
  HOST: effectiveHost,
  PORT: effectivePort
};

// Resolve react-scripts binary cross-platform.
const reactScriptsBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'react-scripts.cmd' : 'react-scripts'
);

// Do not forward any CLI flags to react-scripts. Start the dev server programmatically.
const args = ['start'];

console.log(`Starting CRA dev server on http://${effectiveHost}:${effectivePort} ...`);

const child = spawn(reactScriptsBin, args, {
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
