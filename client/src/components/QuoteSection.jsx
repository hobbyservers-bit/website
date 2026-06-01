import { useRef, useEffect, useState } from 'react';
import styles from './QuoteSection.module.css';

const TEXT  = 'Your World. Spin up a server in seconds, share it with anyone, and play together for free. No strings attached.';
const WORDS = TEXT.split(' ');

const STAGGER     = 0.72 / WORDS.length;
const WINDOW_SIZE = 0.14;

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function wordColor(progress, index) {
  const start = index * STAGGER;
  const t     = smoothstep((progress - start) / WINDOW_SIZE);
  const v     = Math.round(222 - t * (222 - 13));
  return `rgb(${v},${v},${v})`;
}

export default function QuoteSection() {
  const stickyZoneRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = null;

    const tick = () => {
      const zone = stickyZoneRef.current;
      if (!zone) return;
      const rect  = zone.getBoundingClientRect();
      const range = zone.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, -rect.top / range)));
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.outer}>
      <div className={styles.stickyZone} ref={stickyZoneRef}>
        <div className={styles.stickyPane}>
          <p className={styles.quote}>
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={styles.word}
                style={{ color: wordColor(progress, i) }}
              >
                {word}
                {i < WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>

          <div
            className={styles.scrollHint}
            style={{ opacity: Math.max(0, 1 - progress * 8) }}
          >
            <div className={styles.scrollDot} />
            <span>Scroll to reveal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
