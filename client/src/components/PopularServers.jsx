import { useRef } from 'react';
import useApi from '../hooks/useApi';
import useInView from '../hooks/useInView';
import ServerCard from './ServerCard';
import styles from './PopularServers.module.css';

function SkeletonCard() {
  return (
    <div className={styles.skelCard}>
      <div className={`skeleton ${styles.skelTop}`} />
      <div className={`skeleton ${styles.skelLine}`} />
      <div className={`skeleton ${styles.skelLine} ${styles.skelShort}`} />
      <div className={`skeleton ${styles.skelAddr}`} />
    </div>
  );
}

export default function PopularServers() {
  const { data, loading } = useApi('/api/servers?sort=popular&limit=8');
  const [secRef, inView]  = useInView();
  const scrollRef         = useRef(null);

  const servers = data?.data ?? [];

  function scroll(dir) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  }

  return (
    <section className={styles.section} ref={secRef}>
      {/* Header */}
      <div className={styles.header}>
        <div className={`reveal ${inView ? 'visible' : ''}`}>
          <h2 className={styles.title}>Most Popular Servers</h2>
          <p className={styles.sub}>See what everyone's playing right now</p>
        </div>

        <div className={`${styles.arrows} reveal reveal-delay-1 ${inView ? 'visible' : ''}`}>
          <button className={styles.arrowCircle} onClick={() => scroll(-1)} aria-label="Scroll left">
            <i className="fa-solid fa-chevron-left" style={{ fontSize: 14 }} />
          </button>
          <button className={styles.arrowPill} onClick={() => scroll(1)} aria-label="Scroll right">
            <i className="fa-solid fa-chevron-right" style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className={styles.track} ref={scrollRef}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : servers.map((s, i) => (
              <div
                key={s.id}
                className={`reveal ${inView ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.05}s`, flexShrink: 0, width: 320 }}
              >
                <ServerCard server={s} />
              </div>
            ))
        }
      </div>
    </section>
  );
}
