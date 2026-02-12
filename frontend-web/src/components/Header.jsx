import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Globe, User } from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h1>CivicBridge AI</h1>
        </Link>

        <nav style={styles.nav}>
          <Link to="/programs" style={styles.navLink}>{t('programs')}</Link>
          <Link to="/healthcare" style={styles.navLink}>{t('healthcare')}</Link>
          <Link to="/voice-search" style={styles.navLink}>{t('voice_search')}</Link>

          {user ? (
            <>
              <Link to="/profile" style={styles.navLink}>
                <User size={18} style={{ marginRight: '5px' }} />
                {user.name || 'Profile'}
              </Link>
              <button
                onClick={logout}
                style={{ ...styles.navLink, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.navLink}>Login</Link>
          )}

          <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            style={styles.langSelect}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="hi">हिन्दी</option>
          </select>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    color: 'white',
    textDecoration: 'none'
  },
  nav: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background 0.3s'
  },
  langSelect: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px'
  }
};

export default Header;
