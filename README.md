# Project Repository

This repository contains multiple containers. For the Frontend Web Application:

- The API base URL prefers `REACT_APP_BACKEND_URL`. If not set, it falls back to `window.location` with port 3002 and `/api/v1`, and if that fails, it defaults to `https://vscode-internal-40318-beta.beta01.cloud.kavia.ai:3002/api/v1`.
- A lightweight health monitor checks `${API_BASE (without /api/v1) }/health` on startup and with retry/backoff. The connectivity banner is shown when the backend is unreachable and hidden once the backend responds.
- See `FrontendWebApplication/.env.example` for required environment variables.