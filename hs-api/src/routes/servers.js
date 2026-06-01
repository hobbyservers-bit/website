import { Router } from 'express';
import db from '../db.js';
import { MOCK_SERVERS, MOCK_TAGS } from '../mock.js';

const router = Router();

// ── Shared query ───────────────────────────────────────────────────
const SERVER_SELECT = `
  SELECT
    ms.id,
    ms.name,
    ms.subdomain,
    ms.motd,
    ms.status,
    ms.public,
    ms.max_players,
    ms.tag_ids,
    ms.rating_positive,
    ms.rating_negative,
    ms.ip,
    ms.port,
    ms.created_at,
    si.name        AS icon_name,
    si.material    AS icon_material,
    si.rarity      AS icon_rarity
  FROM managed_servers ms
  LEFT JOIN server_icons si ON ms.icon_id = si.id
`;

function shape(row) {
  return {
    id:              row.id,
    name:            row.name,
    subdomain:       row.subdomain,
    address:         `${row.subdomain}.hobbyservers.gg`,
    motd:            row.motd            || 'A HobbyServers server',
    status:          row.status          || 'OFFLINE',
    max_players:     row.max_players     || 20,
    tag_ids:         (() => {
      try { return JSON.parse(row.tag_ids || '[]'); } catch { return []; }
    })(),
    rating_positive: row.rating_positive || 0,
    rating_negative: row.rating_negative || 0,
    ip:              row.ip              || `${row.subdomain}.hobbyservers.gg`,
    port:            row.port            || 25565,
    icon_name:       row.icon_name       || 'Meadow',
    icon_material:   row.icon_material   || 'GRASS_BLOCK',
    icon_rarity:     row.icon_rarity     || 'COMMON',
    created_at:      row.created_at,
  };
}

// ── GET /api/servers/popular ───────────────────────────────────────
router.get('/popular', async (req, res) => {
  try {
    const [rows] = await db.query(
      `${SERVER_SELECT}
       WHERE ms.public = 1 AND ms.status IN ('ONLINE','STARTING')
       ORDER BY ms.rating_positive DESC
       LIMIT 8`
    );
    res.json({ success: true, data: rows.map(shape) });
  } catch (err) {
    console.warn('[DB] popular fallback:', err.message);
    res.json({ success: true, data: MOCK_SERVERS.slice(0, 8), mock: true });
  }
});

// ── GET /api/servers/tags ──────────────────────────────────────────
router.get('/tags', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, display_name, emoji FROM server_tags ORDER BY display_name'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.warn('[DB] tags fallback:', err.message);
    res.json({ success: true, data: MOCK_TAGS, mock: true });
  }
});

// ── GET /api/servers ───────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { tag, sort = 'popular', page = '1', limit = '12' } = req.query;
  const pageNum  = Math.max(1, parseInt(page)   || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
  const offset   = (pageNum - 1) * limitNum;

  try {
    const conditions = ['ms.public = 1'];
    const params     = [];

    if (tag) {
      conditions.push('JSON_CONTAINS(ms.tag_ids, ?)');
      params.push(JSON.stringify(tag));
    }

    const where   = 'WHERE ' + conditions.join(' AND ');
    const orderBy = sort === 'newest'
      ? 'ms.created_at DESC'
      : 'ms.rating_positive DESC';

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM managed_servers ms ${where}`,
      params
    );

    const [rows] = await db.query(
      `${SERVER_SELECT} ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({ success: true, data: rows.map(shape), total, page: pageNum, limit: limitNum });
  } catch (err) {
    console.warn('[DB] servers fallback:', err.message);
    const filtered  = tag ? MOCK_SERVERS.filter(s => s.tag_ids.includes(tag)) : MOCK_SERVERS;
    const paginated = filtered.slice(offset, offset + limitNum);
    res.json({ success: true, data: paginated, total: filtered.length, page: pageNum, limit: limitNum, mock: true });
  }
});

export default router;
