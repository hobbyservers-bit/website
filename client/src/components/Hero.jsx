import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

export default function Hero() {
  const imgRef  = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    let raf = null;
    const tick = () => {
      const card = cardRef.current;
      const img  = imgRef.current;
      if (!card || !img) return;
      const rect   = card.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `translateY(${center * 0.18}px)`;
    };
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} ref={cardRef}>
        <div className={styles.bgWrap}>
          <img ref={imgRef} src="/assets/header-asset.png" alt="" className={styles.bgImg} aria-hidden="true" />
        </div>
        <div className={styles.overlay} />

        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.line}>Your</span>
            <span className={styles.line}>Minecraft</span>
            <span className={`${styles.line} ${styles.accent}`}>Server,</span>
            <span className={styles.line}>Instantly.</span>
          </h1>

          <p className={styles.sub}>
            Your free Minecraft server, ready in seconds. Type&nbsp;
            <span className={styles.code}>/create</span>
            {' '}and play. No setup required.
          </p>

          <div className={styles.actions}>
            <a href="https://dash.hobbyservers.com" target="_blank" rel="noopener noreferrer" className={styles.btnOrange}>
              <span className={`${styles.iconCircle} ${styles.iconLight}`}>
                <i className="fa-solid fa-play" style={{ fontSize: 10, marginLeft: 1 }} />
              </span>
              Start Your Server
            </a>
            <Link to="/#hub" className={styles.btnOutline}>
              <span className={`${styles.iconCircle} ${styles.iconDark}`}>
                <i className="fa-solid fa-earth-americas" style={{ fontSize: 11 }} />
              </span>
              Learn How to Join
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
