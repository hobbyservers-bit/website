import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="HobbyServers home">
          <img src="/assets/asset-4.png" alt="HobbyServers" />
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {[['/', 'Home'], ['/servers', 'Servers'], ['/credits', 'Store']].map(([to, label]) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <button className="btn btn-ghost">Sign In</button>
          <a href="https://dash.hobbyservers.com" target="_blank" rel="noopener noreferrer" className="btn btn-orange btn-sm">Start Your Server</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {[['/', 'Home'], ['/servers', 'Servers'], ['/credits', 'Store']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className={styles.mobileActions}>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Sign In</button>
            <a href="https://dash.hobbyservers.com" target="_blank" rel="noopener noreferrer" className="btn btn-orange" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
              Start Your Server
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
