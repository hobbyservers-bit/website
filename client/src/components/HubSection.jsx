import { useState } from 'react';
import useInView from '../hooks/useInView';
import styles from './HubSection.module.css';

export default function HubSection() {
  const [copied, setCopied] = useState(false);
  const [ref, inView] = useInView();

  function copy() {
    navigator.clipboard.writeText('play.hobbyservers.gg').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className={styles.section} id="hub" ref={ref}>
      <div className={styles.inner}>
        <div className={`${styles.left} reveal ${inView ? 'visible' : ''}`}>
          <span className={styles.label}>Hub Server</span>
          <h2 className={styles.title}>Join via Our Hub</h2>
          <p className={styles.body}>
            Connect to <strong>play.hobbyservers.gg</strong> and spawn into
            the hub. From there, browse active servers, jump into a world, or
            type <code>/create</code> to spin up your own. Everything starts here.
          </p>
          <button className={styles.copyBtn} onClick={copy}>
            <span>{copied ? '✓ Copied!' : 'play.hobbyservers.gg'}</span>
            <span className={styles.copyIcon}>{copied ? '' : '→'}</span>
          </button>
          <div className={styles.badges}>
            <div className={styles.badge}><span>⚡</span> Instant join</div>
            <div className={styles.badge}><span>🌍</span> 24/7 online</div>
            <div className={styles.badge}><span>🔒</span> No whitelist</div>
          </div>
        </div>

        <div className={`${styles.right} reveal reveal-delay-2 ${inView ? 'visible' : ''}`}>
          <div className={styles.imgBox}>
            {/* Minecraft scene CSS illustration */}
            <div className={styles.mcScene}>
              <div className={styles.sky} />
              <div className={styles.pixelGrid} />
              <div className={styles.ground} />
              <div className={styles.sceneLabel}>
                <img src="/assets/asset-5.png" alt="HobbyServers" className={styles.sceneLogo} />
                <p className={styles.sceneText}>play.hobbyservers.gg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
