import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import serversRouter from './routes/servers.js';
import db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 3002;

// ── CORS ──────────────────────────────────────────────────────────
const ALLOWED = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({ origin: ALLOWED, credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/servers', serversRouter);

// Health — tests DB connection
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.query('SELECT 1');
    dbStatus = 'connected';
  } catch {}
  res.json({ ok: true, timestamp: new Date().toISOString(), db: dbStatus });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `No route: ${req.method} ${req.path}` });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦ HobbyServers API`);
  console.log(`  → Local:   http://localhost:${PORT}`);
  console.log(`  → Health:  http://localhost:${PORT}/health`);
  console.log(`  → Servers: http://localhost:${PORT}/api/servers\n`);
});
