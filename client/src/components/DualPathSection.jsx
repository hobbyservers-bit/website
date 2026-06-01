import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView';
import styles from './DualPathSection.module.css';

const HOSTED_FEATURES = [
  'Server live in under 60 seconds',
  'Automatic daily backups included',
  'DDoS protection on every plan',
  'Full mod & plugin support',
  'Live dashboard & console access',
  'Starting at $0 — free forever',
];

const EXTERNAL_FEATURES = [
  'Works with any public-IP server',
  'Lightweight installation',
  'Get your exact specs',
  'Appear in the public server browser',
  'Custom subdomain via hobbyservers.gg',
  'Sync your MOTD and icon to the platform',
];

export default function DualPathSection() {
  const [ref, inView] = useInView();

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>

        {/* Header */}
        <div className={`${styles.header} reveal ${inView ? 'visible' : ''}`}>
          <span className={styles.eyebrow}>Two Ways to Play</span>
          <h2 className={styles.title}>Your server, your way.</h2>
          <p className={styles.sub}>
            Deploy a managed server on our network in seconds, or bring your
            own and manage everything from one place.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.cards}>

          {/* ── Host on HobbyServers ── */}
          <div className={`${styles.card} ${styles.cardHosted} reveal ${inView ? 'visible' : ''}`}>
            <div className={styles.cardInner}>
              <div className={styles.cardIcon} style={{ background: 'rgba(232,100,58,0.10)', color: 'var(--orange)' }}>
                <i className="fa-solid fa-server" style={{ fontSize: 22 }} />
              </div>

              <div className={styles.cardBadge}>Recommended</div>

              <h3 className={styles.cardTitle}>Host on HobbyServers</h3>
              <p className={styles.cardDesc}>
                We handle the hardware, networking, and maintenance.
                You focus on playing. Ready in under 60 seconds.
              </p>

              <ul className={styles.features}>
                {HOSTED_FEATURES.map(f => (
                  <li key={f} className={styles.feature}>
                    <i className="fa-solid fa-check" style={{ fontSize: 11, color: 'var(--orange)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <a href="https://dash.hobbyservers.com" target="_blank" rel="noopener noreferrer" className={`${styles.cardBtn} ${styles.cardBtnOrange}`}>
                Start Your Server <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} />
              </a>
            </div>
          </div>

          {/* ── Connect External ── */}
          <div className={`${styles.card} ${styles.cardExternal} reveal reveal-delay-2 ${inView ? 'visible' : ''}`}>
            <div className={styles.cardInner}>
              <div className={styles.cardIcon} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }}>
                <i className="fa-solid fa-plug" style={{ fontSize: 22 }} />
              </div>

              <h3 className={`${styles.cardTitle} ${styles.cardTitleWhite}`}>Connect External Server</h3>
              <p className={`${styles.cardDesc} ${styles.cardDescMuted}`}>
                Already hosting somewhere else? Install our lightweight
                agent and manage everything from the same dashboard.
              </p>

              <ul className={styles.features}>
                {EXTERNAL_FEATURES.map(f => (
                  <li key={f} className={`${styles.feature} ${styles.featureWhite}`}>
                    <i className="fa-solid fa-check" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/servers" className={`${styles.cardBtn} ${styles.cardBtnOutline}`}>
                Learn More <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
