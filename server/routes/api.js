import express from 'express';

const router = express.Router();
const REAL_API = process.env.HOBBYSERVERS_API_URL || 'http://31.56.65.76:3000';
const API_KEY  = process.env.HOBBYSERVERS_API_KEY  || '';

// ── Shared fetch helper ───────────────────────────────────────────
async function callApi(path) {
  const res = await fetch(`${REAL_API}${path}`, {
    headers: { 'X-Api-Key': API_KEY },
  });
  if (!res.ok) throw new Error(`Real API ${res.status}: ${path}`);
  return res.json();
}

// ── Normalize a server object into the shape the frontend expects ─
function normalize(s) {
  return {
    id:              s.id ?? s.subdomain,
    name:            s.name,
    subdomain:       s.subdomain,
    motd:            s.motd ?? 'A HobbyServers server',
    status:          s.status ?? 'OFFLINE',
    max_players:     s.max_players ?? 20,
    tag_ids:         Array.isArray(s.tag_ids) ? s.tag_ids : [],
    rating_positive: s.rating_positive ?? s.players_online ?? 0,
    rating_negative: s.rating_negative ?? 0,
    ip:              s.ip ?? `${s.subdomain}.hobbyservers.gg`,
    port:            s.port ?? 25565,
    icon_material:   s.icon_material ?? 'GRASS_BLOCK',
    icon_rarity:     s.icon_rarity   ?? 'COMMON',
    address:         `${s.subdomain}.hobbyservers.gg`,
  };
}

// ── Mock fallback ─────────────────────────────────────────────────
const MOCK_SERVERS = [
  { id:'1', name:'SMP World',        subdomain:'smp-world',    motd:'A friendly survival server!',        status:'ONLINE',  max_players:20, tag_ids:['survival','smp'],  rating_positive:188, ip:'smp-world.hobbyservers.gg',    port:25565, icon_material:'GRASS_BLOCK',    icon_rarity:'COMMON'   },
  { id:'2', name:'PvP Arena',        subdomain:'pvp-arena',    motd:'Battle it out in the arena!',        status:'ONLINE',  max_players:50, tag_ids:['competitive'],     rating_positive:145, ip:'pvp-arena.hobbyservers.gg',    port:25565, icon_material:'ANVIL',          icon_rarity:'UNCOMMON' },
  { id:'3', name:'Creative Hub',     subdomain:'creative-hub', motd:'Build anything you can imagine',     status:'ONLINE',  max_players:30, tag_ids:['creative'],        rating_positive:89,  ip:'creative-hub.hobbyservers.gg', port:25565, icon_material:'COBBLESTONE',    icon_rarity:'COMMON'   },
  { id:'4', name:'Modded Adventure', subdomain:'modded-adv',   motd:'Fully modded 1.20 with 200+ mods!', status:'ONLINE',  max_players:15, tag_ids:['modded'],          rating_positive:67,  ip:'modded-adv.hobbyservers.gg',   port:25565, icon_material:'AMETHYST_BLOCK', icon_rarity:'EPIC'     },
  { id:'5', name:'Family Survival',  subdomain:'family-surv',  motd:'Safe and fun for all ages',          status:'ONLINE',  max_players:20, tag_ids:['family_friendly'], rating_positive:54,  ip:'family-surv.hobbyservers.gg',  port:25565, icon_material:'OAK_SAPLING',   icon_rarity:'UNCOMMON' },
  { id:'6', name:'Economy Empire',   subdomain:'economy',      motd:'Build your fortune',                 status:'OFFLINE', max_players:40, tag_ids:['economy'],         rating_positive:41,  ip:'economy.hobbyservers.gg',      port:25565, icon_material:'EMERALD_BLOCK',  icon_rarity:'RARE'     },
];

const MOCK_TAGS = [
  { id:'1',  name:'smp',             display_name:'SMP',             emoji:'⚔️'  },
  { id:'2',  name:'creative',        display_name:'Creative',        emoji:'🎨'  },
  { id:'3',  name:'minigames',       display_name:'Minigames',       emoji:'🎮'  },
  { id:'4',  name:'survival',        display_name:'Survival',        emoji:'🌲'  },
  { id:'5',  name:'modded',          display_name:'Modded',          emoji:'🧩'  },
  { id:'6',  name:'competitive',     display_name:'Competitive',     emoji:'🏆'  },
  { id:'7',  name:'casual',          display_name:'Casual',          emoji:'😊'  },
  { id:'8',  name:'economy',         display_name:'Economy',         emoji:'💰'  },
  { id:'9',  name:'roleplay',        display_name:'Roleplay',        emoji:'🎭'  },
  { id:'10', name:'family_friendly', display_name:'Family Friendly', emoji:'👨‍👩‍👧' },
];

// ── Routes ────────────────────────────────────────────────────────

// Popular servers for the homepage carousel
router.get('/servers/popular', async (req, res) => {
  try {
    const data = await callApi('/api/v1/servers?public=1&status=ONLINE&limit=50');
    const servers = (data.servers ?? [])
      .map(normalize)
      .sort((a, b) => b.rating_positive - a.rating_positive)
      .slice(0, 8);
    res.json({ success: true, data: servers });
  } catch (err) {
    console.warn('[proxy] popular fallback:', err.message);
    res.json({ success: true, data: MOCK_SERVERS.slice(0, 8).map(normalize), mock: true });
  }
});

// All public servers — paginated, filterable by tag
router.get('/servers', async (req, res) => {
  const { tag, sort = 'popular', page = '1', limit = '12' } = req.query;
  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

  try {
    const params = new URLSearchParams({ public: '1', limit: '200' });
    if (tag) params.set('tag', tag);

    const data = await callApi(`/api/v1/servers?${params}`);
    let servers = (data.servers ?? []).map(normalize);

    if (sort === 'newest') {
      servers.sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0));
    } else {
      servers.sort((a, b) => b.rating_positive - a.rating_positive);
    }

    const total     = servers.length;
    const paginated = servers.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    res.json({ success: true, data: paginated, total, page: pageNum, limit: limitNum });
  } catch (err) {
    console.warn('[proxy] servers fallback:', err.message);
    const filtered  = tag ? MOCK_SERVERS.filter(s => s.tag_ids.includes(tag)) : MOCK_SERVERS;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    res.json({ success: true, data: paginated.map(normalize), total: filtered.length, page: pageNum, limit: limitNum, mock: true });
  }
});

// Tags
router.get('/tags', async (req, res) => {
  try {
    const data = await callApi('/api/v1/servers?public=1&limit=200');
    // Extract unique tags from all servers if no dedicated /tags endpoint
    const tagSet = new Set();
    (data.servers ?? []).forEach(s => (s.tag_ids ?? []).forEach(t => tagSet.add(t)));
    const tags = [...tagSet].map((name, i) => {
      const mock = MOCK_TAGS.find(t => t.name === name);
      return mock ?? { id: String(i), name, display_name: name, emoji: '🏷️' };
    });
    res.json({ success: true, data: tags });
  } catch (err) {
    console.warn('[proxy] tags fallback:', err.message);
    res.json({ success: true, data: MOCK_TAGS, mock: true });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const data = await callApi('/health');
    res.json({ success: true, ...data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Health — checks proxy + real API
router.get('/health', async (req, res) => {
  let realApi = 'unreachable';
  try { await callApi('/health'); realApi = 'ok'; } catch {}
  res.json({ ok: true, proxy: 'ok', realApi });
});

export default router;
