#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * dev.js - Safe bootstrap for CRA dev server.
 *
 * This script maps npm_config_port and npm_config_host to environment variables
 * PORT and HOST that Create React App respects. It ensures no shell
 * interpolation happens and prevents trailing flags from reaching the shell.
 *
 * Precedence:
 * 1) npm_config_port/npm_config_host (from `npm run dev -- --port X --host Y`)
 * 2) Existing process.env.PORT/process.env.HOST
 * 3) Default HOST to 0.0.0.0 so the server is reachable externally; PORT falls back to CRA default (3000)
 *
 * It then programmatically invokes `react-scripts start`.
 */

const { spawn } = require('node:child_process');
const path = require('node:path');

// Read preferred host/port from npm config flags if provided
// npm passes --port=X as npm_config_port and --host=Y as npm_config_host
const npmPort = process.env.npm_config_port;
const npmHost = process.env.npm_config_host;

// Establish effective HOST and PORT following precedence rules
const effectiveHost = npmHost || process.env.HOST || '0.0.0.0';
const effectivePort = npmPort || process.env.PORT; // allow CRA to default if undefined

// Mutate env for child process
const childEnv = { ...process.env, HOST: effectiveHost };
if (effectivePort) {
  childEnv.PORT = effectivePort;
}

// Resolve react-scripts binary
const reactScriptsBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'react-scripts.cmd' : 'react-scripts'
);

// Spawn react-scripts start without passing user flags to the shell
const child = spawn(reactScriptsBin, ['start'], {
  stdio: 'inherit',
  env: childEnv,
  shell: false
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`react-scripts exited due to signal: ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
