/**
 * Thin wrapper around the real HobbyServers backend.
 * Every request forwards the X-Api-Key header automatically.
 */

const BASE = process.env.HOBBYSERVERS_API_URL || 'http://31.56.65.76:3000';
const KEY  = process.env.HOBBYSERVERS_API_KEY  || '';

export async function upstream(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Api-Key': KEY },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Upstream ${res.status} — ${path}`);
  return res.json();
}
