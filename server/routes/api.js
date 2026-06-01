import express from 'express';
import db from '../db.js';

const router = express.Router();

// ── Mock fallbacks ────────────────────────────────────────────────────
const MOCK_SERVERS = [
  { id: '1', name: 'SMP World', subdomain: 'smp-world', motd: 'A friendly survival multiplayer for everyone!', status: 'ONLINE', max_players: 20, tag_ids: JSON.stringify(['survival','smp']), rating_positive: 188, rating_negative: 2, ip: 'smp-world.hobbyservers.gg', port: 25565, icon_name: 'Meadow', icon_material: 'GRASS_BLOCK', icon_rarity: 'COMMON' },
  { id: '2', name: 'PvP Arena', subdomain: 'pvp-arena', motd: 'Battle it out in the arena — no mercy!', status: 'ONLINE', max_players: 50, tag_ids: JSON.stringify(['competitive']), rating_positive: 145, rating_negative: 5, ip: 'pvp-arena.hobbyservers.gg', port: 25565, icon_name: 'Anvil', icon_material: 'ANVIL', icon_rarity: 'UNCOMMON' },
  { id: '3', name: 'Creative Hub', subdomain: 'creative-hub', motd: 'Build anything you can imagine, no limits', status: 'ONLINE', max_players: 30, tag_ids: JSON.stringify(['creative']), rating_positive: 89, rating_negative: 1, ip: 'creative-hub.hobbyservers.gg', port: 25565, icon_name: 'Cobble', icon_material: 'COBBLESTONE', icon_rarity: 'COMMON' },
  { id: '4', name: 'Modded Adventure', subdomain: 'modded-adv', motd: 'Fully modded 1.20 with 200+ mods!', status: 'ONLINE', max_players: 15, tag_ids: JSON.stringify(['modded']), rating_positive: 67, rating_negative: 3, ip: 'modded-adv.hobbyservers.gg', port: 25565, icon_name: 'Void Crystal', icon_material: 'AMETHYST_BLOCK', icon_rarity: 'EPIC' },
  { id: '5', name: 'Family Survival', subdomain: 'family-survival', motd: 'Safe, friendly, and fun for all ages', status: 'ONLINE', max_players: 20, tag_ids: JSON.stringify(['family_friendly','survival']), rating_positive: 54, rating_negative: 0, ip: 'family-survival.hobbyservers.gg', port: 25565, icon_name: 'Sprout', icon_material: 'OAK_SAPLING', icon_rarity: 'UNCOMMON' },
  { id: '6', name: 'Economy Empire', subdomain: 'economy-empire', motd: 'Build your fortune in our player-driven economy', status: 'OFFLINE', max_players: 40, tag_ids: JSON.stringify(['economy']), rating_positive: 41, rating_negative: 2, ip: 'economy-empire.hobbyservers.gg', port: 25565, icon_name: 'Emerald Vault', icon_material: 'EMERALD_BLOCK', icon_rarity: 'RARE' },
  { id: '7', name: 'Minigame Madness', subdomain: 'minigame-madness', motd: 'Dozens of minigames — new ones added weekly', status: 'ONLINE', max_players: 100, tag_ids: JSON.stringify(['minigames','casual']), rating_positive: 35, rating_negative: 1, ip: 'minigame-madness.hobbyservers.gg', port: 25565, icon_name: 'Nether Star', icon_material: 'NETHER_STAR', icon_rarity: 'EPIC' },
  { id: '8', name: 'Dragon Realm', subdomain: 'dragon-realm', motd: 'Hardcore roleplay server — will you survive?', status: 'ONLINE', max_players: 25, tag_ids: JSON.stringify(['roleplay','competitive']), rating_positive: 29, rating_negative: 4, ip: 'dragon-realm.hobbyservers.gg', port: 25565, icon_name: 'Dragon Wing', icon_material: 'ELYTRA', icon_rarity: 'LEGENDARY' },
];

const MOCK_TAGS = [
  { id: '1', name: 'smp',             display_name: 'SMP',             emoji: '⚔️' },
  { id: '2', name: 'creative',        display_name: 'Creative',        emoji: '🎨' },
  { id: '3', name: 'minigames',       display_name: 'Minigames',       emoji: '🎮' },
  { id: '4', name: 'survival',        display_name: 'Survival',        emoji: '🌲' },
  { id: '5', name: 'modded',          display_name: 'Modded',          emoji: '🧩' },
  { id: '6', name: 'competitive',     display_name: 'Competitive',     emoji: '🏆' },
  { id: '7', name: 'casual',          display_name: 'Casual',          emoji: '😊' },
  { id: '8', name: 'economy',         display_name: 'Economy',         emoji: '💰' },
  { id: '9', name: 'roleplay',        display_name: 'Roleplay',        emoji: '🎭' },
  { id: '10', name: 'family_friendly', display_name: 'Family',         emoji: '👨‍👩‍👧' },
];

// ── Helper ────────────────────────────────────────────────────────────
function normalizeServer(row) {
  return {
    ...row,
    tag_ids: typeof row.tag_ids === 'string' ? JSON.parse(row.tag_ids) : (row.tag_ids ?? []),
    address: `${row.subdomain}.hobbyservers.gg`,
  };
}

// ── Routes ────────────────────────────────────────────────────────────

// Popular servers for homepage
router.get('/servers/popular', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        ms.id, ms.name, ms.subdomain, ms.motd, ms.status,
        ms.max_players, ms.ram_mb, ms.tag_ids,
        ms.rating_positive, ms.rating_negative,
        ms.ip, ms.port,
        si.name   AS icon_name,
        si.material AS icon_material,
        si.rarity   AS icon_rarity
      FROM managed_servers ms
      LEFT JOIN server_icons si ON ms.icon_id = si.id
      WHERE ms.public = 1
      ORDER BY ms.rating_positive DESC
      LIMIT 8
    `);
    res.json({ success: true, data: rows.map(normalizeServer) });
  } catch (err) {
    console.warn('[DB] popular servers fallback:', err.message);
    res.json({ success: true, data: MOCK_SERVERS.slice(0, 8).map(normalizeServer), mock: true });
  }
});

// All public servers (paginated, filterable)
router.get('/servers', async (req, res) => {
  const { tag, sort = 'popular', page = '1', limit = '12' } = req.query;
  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const offset   = (pageNum - 1) * limitNum;

  try {
    const whereParts = ['ms.public = 1'];
    const params = [];

    if (tag) {
      whereParts.push('JSON_CONTAINS(ms.tag_ids, ?)');
      params.push(JSON.stringify(tag));
    }

    const where   = 'WHERE ' + whereParts.join(' AND ');
    const orderBy = sort === 'newest' ? 'ms.created_at DESC' : 'ms.rating_positive DESC';

    const [rows] = await db.query(`
      SELECT
        ms.id, ms.name, ms.subdomain, ms.motd, ms.status,
        ms.max_players, ms.ram_mb, ms.tag_ids,
        ms.rating_positive, ms.rating_negative,
        ms.ip, ms.port,
        si.name   AS icon_name,
        si.material AS icon_material,
        si.rarity   AS icon_rarity
      FROM managed_servers ms
      LEFT JOIN server_icons si ON ms.icon_id = si.id
      ${where}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [...params, limitNum, offset]);

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM managed_servers ms ${where}`,
      params
    );

    res.json({ success: true, data: rows.map(normalizeServer), total, page: pageNum, limit: limitNum });
  } catch (err) {
    console.warn('[DB] servers list fallback:', err.message);
    const filtered = tag
      ? MOCK_SERVERS.filter(s => {
          const ids = typeof s.tag_ids === 'string' ? JSON.parse(s.tag_ids) : s.tag_ids;
          return ids.includes(tag);
        })
      : MOCK_SERVERS;
    res.json({ success: true, data: filtered.map(normalizeServer), total: filtered.length, page: pageNum, limit: limitNum, mock: true });
  }
});

// Tags list
router.get('/tags', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM server_tags ORDER BY display_name');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.warn('[DB] tags fallback:', err.message);
    res.json({ success: true, data: MOCK_TAGS, mock: true });
  }
});

// Site setting
router.get('/settings/:key', async (req, res) => {
  try {
    const [[row]] = await db.query(
      'SELECT setting_value FROM hobbyservers_settings WHERE setting_key = ?',
      [req.params.key]
    );
    res.json({ success: true, value: row?.setting_value ?? null });
  } catch (err) {
    res.json({ success: false, error: err.message, value: null });
  }
});

// Health
router.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch {
    res.json({ ok: true, db: 'disconnected (using mock data)' });
  }
});

export default router;
