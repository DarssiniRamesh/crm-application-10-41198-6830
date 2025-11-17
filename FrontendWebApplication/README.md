# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

### Preview/Dev Server Port and Host

The dev bootstrap script (`scripts/dev.js`) enforces a stable binding and swallows all CLI flags:

- HOST is always set to `0.0.0.0` (external access enabled).
- Port selection precedence:
  1) `PORT` or `REACT_APP_PORT` environment variables if set
  2) `npm_config_port` if provided (e.g., `npm_config_port=3010 npm run dev`)
  3) Defaults to `3001`

Any trailing CLI flags are not passed to the shell or `react-scripts`, preventing `/bin/sh: 0: Illegal option --` errors and avoiding unexpected port/host overrides.

Examples:
- `npm run dev` → listens on `0.0.0.0:3001`
- `PORT=3001 npm run dev` → listens on `0.0.0.0:3001`
- `npm_config_port=3010 npm run dev` → listens on `0.0.0.0:3010`
- `npm run dev -- --port 4000` → still ignores flags; port is determined by env/`npm_config_port`/default

Note: This script intentionally ignores host/port values passed via CLI flags; use the environment variables mentioned above or `npm_config_port` to control the port.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Backend URL and Health Monitoring

The frontend calls the backend over HTTPS. The API base is resolved as follows:

1. `REACT_APP_BACKEND_URL` if set (e.g., `https://your-host:3002/api/v1`)
2. If not set, the app derives one from `window.location` by keeping the same host and switching the port to `3002`, then appending `/api/v1`
3. If derivation fails, it defaults to:  
   `https://vscode-internal-40318-beta.beta01.cloud.kavia.ai:3002/api/v1`

A lightweight health monitor pings `${API_BASE (without /api/v1) }/health` with retry/backoff on app startup and periodically thereafter. If the backend is unreachable, a banner appears; it clears automatically once the backend becomes reachable again.

CORS guidance:
- All requests are made with `credentials: 'omit'` by default and standard JSON headers to minimize preflight issues.
- Ensure the backend permits CORS from the frontend origin if served on a different port/host.

### Environment Variables

Create a `.env` file (or use your deployment system) with:

- `REACT_APP_BACKEND_URL` (optional): Absolute base URL to the backend API. Example: `https://your-host:3002/api/v1`
- `REACT_APP_FRONTEND_URL` (optional): Public URL of this SPA for OAuth2 redirects.
- `REACT_APP_LOG_LEVEL` (optional): One of `debug`, `info` (default), `warn`, `error`.

See `.env.example` for a ready-to-copy template.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
