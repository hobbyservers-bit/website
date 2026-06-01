import { useState } from 'react';
import useApi from '../hooks/useApi';
import useInView from '../hooks/useInView';
import ServerCard from '../components/ServerCard';
import styles from './Servers.module.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest',  label: 'Newest First' },
];

/* Map tag names → Font Awesome icon classes */
const TAG_ICONS = {
  smp:             'fa-solid fa-shield-halved',
  creative:        'fa-solid fa-paintbrush',
  minigames:       'fa-solid fa-gamepad',
  farming:         'fa-solid fa-wheat-awn',
  survival:        'fa-solid fa-tree',
  roleplay:        'fa-solid fa-masks-theater',
  competitive:     'fa-solid fa-trophy',
  casual:          'fa-regular fa-face-smile',
  modded:          'fa-solid fa-puzzle-piece',
  family_friendly: 'fa-solid fa-people-roof',
  economy:         'fa-solid fa-coins',
  arcade:          'fa-solid fa-dice',
};

function TagIcon({ name }) {
  const cls = TAG_ICONS[name] ?? 'fa-solid fa-tag';
  return <i className={cls} style={{ fontSize: 12 }} />;
}

export default function Servers() {
  const [tag,  setTag]  = useState('');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  const url = `/api/servers?sort=${sort}&page=${page}&limit=12${tag ? `&tag=${tag}` : ''}`;
  const { data: serversData, loading } = useApi(url);
  const { data: tagsData }             = useApi('/api/tags');

  const servers = serversData?.data ?? [];
  const tags    = tagsData?.data    ?? [];
  const total   = serversData?.total ?? 0;
  const pages   = Math.ceil(total / 12);

  const [bodyRef, bodyIn] = useInView();

  function clearFilters() {
    setTag('');
    setSort('popular');
    setPage(1);
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            {total > 0 ? `${total} servers live` : 'Servers live'}
          </div>

          <h1 className={styles.heroTitle}>
            Find your<br />
            <span className={styles.heroAccent}>next server.</span>
          </h1>

          <p className={styles.heroSub}>
            Browse community-run Minecraft servers — survival, creative,
            minigames, modded, and more.
          </p>

          {/* Quick-filter tags in hero */}
          {tags.length > 0 && (
            <div className={styles.heroTags}>
              {tags.slice(0, 6).map(t => (
                <button
                  key={t.id}
                  className={`${styles.heroTag} ${tag === t.name ? styles.heroTagActive : ''}`}
                  onClick={() => { setTag(tag === t.name ? '' : t.name); setPage(1); }}
                >
                  <TagIcon name={t.name} />
                  {t.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Browse section ────────────────────────────────── */}
      <section className={styles.browse} ref={bodyRef}>

        {/* Controls */}
        <div className={`${styles.controls} reveal ${bodyIn ? 'visible' : ''}`}>
          <div className={styles.controlsLeft}>
            <h2 className={styles.browseTitle}>
              {tag
                ? `${tags.find(t => t.name === tag)?.display_name ?? tag} servers`
                : 'All servers'}
            </h2>
            {(tag || sort !== 'popular') && (
              <button className={styles.clearBtn} onClick={clearFilters}>Clear ×</button>
            )}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Tag chips */}
        <div className={`${styles.tagBar} reveal reveal-delay-1 ${bodyIn ? 'visible' : ''}`}>
          <button
            className={`${styles.tagChip} ${!tag ? styles.tagActive : ''}`}
            onClick={() => { setTag(''); setPage(1); }}
          >
            <i className="fa-solid fa-border-all" style={{ fontSize: 11 }} /> All
          </button>
          {tags.map(t => (
            <button
              key={t.id}
              className={`${styles.tagChip} ${tag === t.name ? styles.tagActive : ''}`}
              onClick={() => { setTag(t.name); setPage(1); }}
            >
              <TagIcon name={t.name} />
              {t.display_name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skelCard}>
                <div className="skeleton" style={{ height: 36, borderRadius: 10, marginBottom: 14 }} />
                <div className="skeleton" style={{ height: 13, borderRadius: 6, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 13, borderRadius: 6, width: '65%', marginBottom: 14 }} />
                <div className="skeleton" style={{ height: 38, borderRadius: 10 }} />
              </div>
            ))}
          </div>
        ) : servers.length === 0 ? (
          <div className={styles.empty}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 36, color: 'var(--gray-400)' }} />
            <p className={styles.emptyText}>No servers match this filter.</p>
            <button className={styles.clearBtn} onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {servers.map(s => <ServerCard key={s.id} server={s} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
