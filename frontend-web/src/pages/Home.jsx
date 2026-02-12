import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, GraduationCap, Briefcase, Mic } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={styles.container}>
      <section style={styles.hero}>
        <h1 style={styles.title}>{t('welcome')}</h1>
        <p style={styles.subtitle}>
          {t('intro')}
        </p>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder={typeof t('search') === 'string' ? t('search') : 'Search for resources'}
            style={styles.searchInput}
          />
          <button className="btn btn-primary">{t('search')}</button>
        </div>
      </section>

      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>{t('what_we_offer')}</h2>
        <div style={styles.grid}>
          <Link to="/programs?category=HEALTHCARE" style={styles.featureCard}>
            <Heart size={48} color="#2563eb" />
            <h3>{t('healthcare')}</h3>
            <p>{t('find_nearby_hospitals')}</p>
          </Link>

          <Link to="/programs?category=EDUCATION" style={styles.featureCard}>
            <GraduationCap size={48} color="#2563eb" />
            <h3>{t('education')}</h3>
            <p>{t('discover_scholarships')}</p>
          </Link>

          <Link to="/programs?category=EMPLOYMENT" style={styles.featureCard}>
            <Briefcase size={48} color="#2563eb" />
            <h3>{t('employment')}</h3>
            <p>{t('job_training')}</p>
          </Link>

          <Link to="/voice-search" style={styles.featureCard}>
            <Mic size={48} color="#2563eb" />
            <h3>{t('voice_search')}</h3>
            <p>{t('voice_commands_desc')}</p>
          </Link>
        </div>
      </section>

      <section style={styles.cta}>
        <h2>{t('ready_to_start')}</h2>
        <p>{t('explore_resources')}</p>
        <Link to="/programs">
          <button className="btn btn-primary" style={styles.ctaButton}>
            {t('browse_programs')}
          </button>
        </Link>
      </section>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '40px',
    paddingBottom: '40px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: {
    fontSize: '48px',
    color: '#1f2937',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '20px',
    color: '#6b7280',
    marginBottom: '30px'
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    justifyContent: 'center'
  },
  searchInput: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '5px'
  },
  features: {
    marginBottom: '60px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#1f2937',
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px'
  },
  featureCard: {
    padding: '30px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.3s'
  },
  cta: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  ctaButton: {
    marginTop: '20px',
    fontSize: '18px',
    padding: '15px 30px'
  }
};

export default Home;
