# Frontend (Vite + React + Tailwind)

This folder contains a lightweight Vite React + Tailwind scaffold that integrates with the backend APIs in this workspace.

Quick start

1. cd into the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

Notes
- API base URL is proxied to `http://localhost:3000` by Vite config. If your backend runs on a different host/port, update `vite.config.js` or set `VITE_API_BASE` in `.env`.
- The scaffold includes `services/` for API calls and `contexts/` for Auth and Products. Create/Cart pages are placeholders.
- This is a starting point; add forms, validations, and additional components as needed.
