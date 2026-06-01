/**
 * Converts a raw server object from the upstream API
 * into the consistent shape the frontend expects.
 */
export function normalizeServer(s) {
  return {
    id:              s.id ?? s.subdomain,
    name:            s.name,
    subdomain:       s.subdomain,
    address:         `${s.subdomain}.hobbyservers.gg`,
    motd:            s.motd            ?? 'A HobbyServers server',
    status:          s.status          ?? 'OFFLINE',
    max_players:     s.max_players     ?? 20,
    tag_ids:         Array.isArray(s.tag_ids) ? s.tag_ids : [],
    rating_positive: s.rating_positive ?? s.players_online ?? 0,
    rating_negative: s.rating_negative ?? 0,
    ip:              s.ip              ?? `${s.subdomain}.hobbyservers.gg`,
    port:            s.port            ?? 25565,
    icon_material:   s.icon_material   ?? 'GRASS_BLOCK',
    icon_rarity:     s.icon_rarity     ?? 'COMMON',
    created_at:      s.created_at,
  };
}
