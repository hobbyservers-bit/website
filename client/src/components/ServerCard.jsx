import { useState } from 'react';
import styles from './ServerCard.module.css';

/* ── Real Minecraft block textures ───────────────────────────────── */
const BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.4/assets/minecraft/textures/';

const MATERIAL_TEXTURES = {
  GRASS_BLOCK:    BASE + 'block/grass_block_top.png',
  COBBLESTONE:    BASE + 'block/cobblestone.png',
  OAK_SAPLING:    BASE + 'item/oak_sapling.png',
  ANVIL:          BASE + 'block/anvil_top.png',
  LAPIS_BLOCK:    BASE + 'block/lapis_block.png',
  EMERALD_BLOCK:  BASE + 'block/emerald_block.png',
  AMETHYST_BLOCK: BASE + 'block/amethyst_block.png',
  NETHER_STAR:    BASE + 'item/nether_star.png',
  GOLDEN_HELMET:  BASE + 'item/golden_helmet.png',
  ELYTRA:         BASE + 'item/elytra.png',
  END_CRYSTAL:    BASE + 'item/end_crystal.png',
  BEACON:         BASE + 'block/beacon.png',
};

/* Fallback color if texture fails to load */
const FALLBACK_COLORS = {
  GRASS_BLOCK:    '#5ea832',
  COBBLESTONE:    '#9a9a9a',
  OAK_SAPLING:    '#5ea832',
  ANVIL:          '#6b6b6b',
  LAPIS_BLOCK:    '#2255cc',
  EMERALD_BLOCK:  '#22c55e',
  AMETHYST_BLOCK: '#a855f7',
  NETHER_STAR:    '#fbbf24',
  GOLDEN_HELMET:  '#fbbf24',
  ELYTRA:         '#818cf8',
  END_CRYSTAL:    '#06b6d4',
  BEACON:         '#22d3ee',
};

function BlockIcon({ material }) {
  const [errored, setErrored] = useState(false);
  const src = MATERIAL_TEXTURES[material] ?? MATERIAL_TEXTURES.GRASS_BLOCK;
  const fallback = FALLBACK_COLORS[material] ?? '#5ea832';

  if (errored) {
    return (
      <div
        className={styles.blockFallback}
        style={{ background: fallback }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={material}
      className={styles.blockIcon}
      onError={() => setErrored(true)}
      draggable={false}
    />
  );
}

export default function ServerCard({ server }) {
  const [copied, setCopied] = useState(false);

  const address  = `${server.subdomain}.hobbyservers.gg`;
  const material = server.icon_material ?? 'GRASS_BLOCK';
  const online   = server.rating_positive ?? 0;

  function copy() {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className={styles.card}>
      {/* Row 1: icon + name */}
      <div className={styles.top}>
        <BlockIcon material={material} />
        <span className={styles.name}>{server.name}</span>
      </div>

      {/* Row 2: online count */}
      <div className={styles.online}>
        <i className="fa-solid fa-users" style={{ fontSize: 12, color: '#22c55e' }} />
        <span className={styles.onlineNum}>{online.toLocaleString()}</span>
        <span className={styles.onlineLabel}>online</span>
      </div>

      {/* MOTD */}
      <p className={styles.motd}>{server.motd || 'A HobbyServers server'}</p>

      {/* Address bar */}
      <button
        className={`${styles.addressBar} ${copied ? styles.copied : ''}`}
        onClick={copy}
        title="Click to copy"
      >
        <span className={styles.addressText}>{address}</span>
        <i
          className={copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}
          style={{ fontSize: 13, color: copied ? '#22c55e' : '#999', flexShrink: 0 }}
        />
      </button>
    </div>
  );
}
