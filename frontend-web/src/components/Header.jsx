import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { User, Menu, X } from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <h1>CivicBridge AI</h1>
        </Link>

        {/* Desktop Nav */}
        <nav style={styles.desktopNav}>
          <Link to="/programs" style={styles.navLink}>{t('programs')}</Link>
          <Link to="/healthcare" style={styles.navLink}>{t('healthcare')}</Link>
          <Link to="/voice-search" style={styles.navLink}>{t('voice_search')}</Link>

          {user ? (
            <>
              {user.roles?.includes('ROLE_ADMIN') && (
                <Link to="/admin" style={styles.navLink}>
                  {t('admin')}
                </Link>
              )}
              <Link to="/profile" style={styles.navLink}>
                <User size={18} style={{ marginRight: '5px' }} />
                {user.name || t('profile')}
              </Link>
              <button
                onClick={handleLogout}
                style={{ ...styles.navLink, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.navLink}>{t('login')}</Link>
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

        {/* Mobile Toggle */}
        <button style={styles.menuToggle} onClick={toggleMenu} aria-label={isMenuOpen ? t('close') : t('menu')}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav style={styles.mobileNav}>
            <Link to="/programs" style={styles.mobileNavLink} onClick={toggleMenu}>{t('programs')}</Link>
            <Link to="/healthcare" style={styles.mobileNavLink} onClick={toggleMenu}>{t('healthcare')}</Link>
            <Link to="/voice-search" style={styles.mobileNavLink} onClick={toggleMenu}>{t('voice_search')}</Link>
            {user ? (
              <>
                {user.roles?.includes('ROLE_ADMIN') && (
                  <Link to="/admin" style={styles.mobileNavLink} onClick={toggleMenu}>{t('admin')}</Link>
                )}
                <Link to="/profile" style={styles.mobileNavLink} onClick={toggleMenu}>{t('profile')}</Link>
                <button onClick={handleLogout} style={styles.mobileNavLink}>{t('logout')}</button>
              </>
            ) : (
              <Link to="/login" style={styles.mobileNavLink} onClick={toggleMenu}>{t('login')}</Link>
            )}
            <div style={styles.mobileLangSection}>
              <select
                value={currentLanguage}
                onChange={(e) => {
                  changeLanguage(e.target.value);
                  toggleMenu();
                }}
                style={styles.langSelect}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    zIndex: 1001
  },
  desktopNav: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background 0.3s',
    display: 'flex',
    alignItems: 'center'
  },
  langSelect: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    zIndex: 1001,
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  mobileNav: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: '#2563eb',
    padding: '80px 20px 20px',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 1000,
    '@media (max-width: 768px)': {
      display: 'flex'
    }
  },
  mobileNavLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    width: '100%'
  },
  mobileLangSection: {
    marginTop: 'auto',
    padding: '20px 0'
  }
};

export default Header;
