import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, GraduationCap, Briefcase, Mic } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section style={styles.hero}>
        <div className="container">
          <h1 style={styles.title}>{t('welcome')}</h1>
          <p style={styles.subtitle}>{t('intro')}</p>
          <Link to="/programs" className="btn btn-primary" style={styles.ctaButton}>
            {t('browse_programs')}
          </Link>
        </div>
      </section>

      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>{t('what_we_offer')}</h2>
          <div style={styles.grid}>
            <FeatureCard
              icon={<Heart size={48} color="#2563eb" />}
              title={t('healthcare')}
              description={t('find_nearby_hospitals')}
              link="/programs?category=HEALTHCARE"
            />
            <FeatureCard
              icon={<GraduationCap size={48} color="#2563eb" />}
              title={t('education')}
              description={t('discover_scholarships')}
              link="/programs?category=EDUCATION"
            />
            <FeatureCard
              icon={<Briefcase size={48} color="#2563eb" />}
              title={t('employment')}
              description={t('job_training')}
              link="/programs?category=EMPLOYMENT"
            />
            <FeatureCard
              icon={<Mic size={48} color="#2563eb" />}
              title={t('voice_search')}
              description={t('voice_commands_desc')}
              link="/voice-search"
            />
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <div className="container">
          <h2 style={styles.sectionTitle}>{t('ready_to_start')}</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#4b5563' }}>
            {t('explore_resources')}
          </p>
          <Link to="/programs" className="btn btn-primary" style={styles.ctaButton}>
            {t('browse_programs')}
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link }) => (
  <Link to={link} style={styles.featureCard}>
    <div style={{ marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{title}</h3>
    <p style={{ color: '#6b7280' }}>{description}</p>
  </Link>
);

const styles = {
  hero: {
    backgroundColor: '#f9fafb',
    padding: '80px 0',
    textAlign: 'center'
  },
  title: {
    fontSize: '48px',
    color: '#1f2937',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '20px',
    color: '#6b7280',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px'
  },
  ctaButton: {
    fontSize: '18px',
    padding: '15px 30px'
  },
  features: {
    padding: '80px 0'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#1f2937',
    marginBottom: '50px'
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cta: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '80px 0',
    textAlign: 'center'
  }
};

export default Home;
