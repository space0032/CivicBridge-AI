import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, GraduationCap, Briefcase, Mic } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{t('welcome')}</h1>
          <p className="hero-subtitle">{t('intro')}</p>
          <Link to="/programs" className="btn btn-primary cta-button">
            {t('browse_programs')}
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t('what_we_offer')}</h2>
          <div className="features-grid">
            <FeatureCard
              icon={<Heart size={32} color="#2563eb" />}
              title={t('healthcare')}
              description={t('find_nearby_hospitals')}
              link="/programs?category=HEALTHCARE"
            />
            <FeatureCard
              icon={<GraduationCap size={32} color="#2563eb" />}
              title={t('education')}
              description={t('discover_scholarships')}
              link="/programs?category=EDUCATION"
            />
            <FeatureCard
              icon={<Briefcase size={32} color="#2563eb" />}
              title={t('employment')}
              description={t('job_training')}
              link="/programs?category=EMPLOYMENT"
            />
            <FeatureCard
              icon={<Mic size={32} color="#2563eb" />}
              title={t('voice_search')}
              description={t('voice_commands_desc')}
              link="/voice-search"
            />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="section-title">{t('ready_to_start')}</h2>
          <p className="cta-description">
            {t('explore_resources')}
          </p>
          <Link to="/programs" className="cta-button">
            {t('browse_programs')}
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link }) => (
  <Link to={link} className="feature-card">
    <div className="feature-icon-wrapper">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </Link>
);

export default Home;
