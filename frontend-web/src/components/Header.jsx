import React from 'react';
import { Link } from 'react-router-dom';
import { useIntlayer } from 'react-intlayer';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, Globe } from 'lucide-react';

const Header = () => {
  const { programs, healthcare, voice_search } = useIntlayer('common');
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <h1>CivicBridge AI</h1>
        </Link>
        
        <nav style={styles.nav}>
          <Link to="/programs" style={styles.navLink}>{programs}</Link>
          <Link to="/healthcare" style={styles.navLink}>{healthcare}</Link>
          <Link to="/voice-search" style={styles.navLink}>{voice_search}</Link>
          
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
