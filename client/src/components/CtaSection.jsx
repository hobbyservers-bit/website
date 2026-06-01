import { Link } from 'react-router-dom';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <img
          src="/assets/cta-asset.png"
          alt="Join the HobbyServers hub"
          className={styles.img}
        />
        <div className={styles.overlay}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>play.hobbyservers.gg</p>
            <h2 className={styles.title}>Ready to play?</h2>
            <p className={styles.sub}>
              Join thousands of players already running servers.<br />
              Free to start — no credit card needed.
            </p>
            <div className={styles.actions}>
              <a href="https://dash.hobbyservers.com" target="_blank" rel="noopener noreferrer" className="btn btn-orange btn-lg">
                Start Your Server
              </a>
              <Link to="/servers" className="btn btn-outline-white btn-lg">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
