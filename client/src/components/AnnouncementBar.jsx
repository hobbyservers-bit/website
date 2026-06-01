import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <i className="fa-solid fa-bolt" style={{ fontSize: 12 }} />
        <span className={styles.text}>
          <strong>15% OFF ALL SERVERS</strong> — Limited time deal
        </span>
        <Link to="/servers" className={styles.link}>
          Explore <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
        </Link>
      </div>
      <button className={styles.close} onClick={() => setVisible(false)} aria-label="Dismiss">
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}
