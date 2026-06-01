import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* Background watermark image */}
      <img
        src="/assets/lowOpacity.png"
        alt=""
        aria-hidden="true"
        className={styles.watermark}
      />

      <div className={styles.inner}>
        {/* ── Top row ─────────────────────────────────────────── */}
        <div className={styles.top}>

          {/* Left: logo */}
          <Link to="/" className={styles.logo}>
            <img src="/assets/asset-4.png" alt="" className={styles.logoIcon} />
            <span className={styles.logoText}>hobbyservers</span>
          </Link>

          {/* Right: links + socials */}
          <div className={styles.right}>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLink}>Privacy Policy</a>
              <a href="#" className={styles.navLink}>Terms of Service</a>
              <a href="mailto:hello@hobbyservers.gg" className={styles.navLink}>
                <i className="fa-regular fa-envelope" />
                Contact Us
              </a>
            </div>

            <div className={styles.socials}>
              <a href="https://x.com/hobbyservers" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X / Twitter">
                <i className="fa-brands fa-x-twitter" />
              </a>
              <a href="https://youtube.com/@hobbyservers" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                <i className="fa-brands fa-youtube" />
              </a>
              <a href="https://instagram.com/hobbyservers" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="https://tiktok.com/@hobbyservers" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">
                <i className="fa-brands fa-tiktok" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Copyright ────────────────────────────────────────── */}
        <div className={styles.copyright}>
          © {new Date().getFullYear()} HobbyServers. A playful, serious new home for game servers.
        </div>
      </div>
    </footer>
  );
}
