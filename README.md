# HobbyServers Web

React + Express + MySQL website for HobbyServers.

## Quick Start

### 1. Backend (API)

```bash
cd server
cp .env.example .env       # fill in your DB credentials
npm install
npm run dev                # → http://localhost:3001
```

### 2. Frontend (React)

```bash
cd client
npm install
npm run dev                # → http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:3001` automatically.

---

## Project Structure

```
client/          React + Vite frontend
  src/
    components/  Navbar, Hero, ServerCard, Footer, …
    pages/       Home, Servers, Credits
    hooks/       useApi, useInView
server/          Express REST API
  routes/api.js  /api/servers, /api/tags, /api/settings
  db.js          mysql2 connection pool
assets/          Brand assets (source)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/servers/popular` | Top 8 public servers by rating |
| GET | `/api/servers?tag=&sort=popular&page=1` | Paginated server list |
| GET | `/api/tags` | All server tags |
| GET | `/api/settings/:key` | Site settings |
| GET | `/api/health` | DB connection check |

The API falls back to realistic mock data if the DB is unreachable.
