import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div style={styles.column}>
            <h3 style={styles.heading}>CivicBridge AI</h3>
            <p style={styles.tagline}>
              Empowering communities through accessible civic resources.
            </p>
          </div>
          <div style={styles.column}>
            <h3 style={styles.heading}>Quick Links</h3>
            <ul style={styles.linkList}>
              <li><Link to="/programs" style={styles.link}>Programs</Link></li>
              <li><Link to="/healthcare" style={styles.link}>Healthcare</Link></li>
              <li><Link to="/voice-search" style={styles.link}>Voice Search</Link></li>
              <li><Link to="/profile" style={styles.link}>Profile</Link></li>
            </ul>
          </div>
          <div style={styles.column}>
            <h3 style={styles.heading}>Contact Us</h3>
            <p>Email: contact@civicbridge.ai</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div style={styles.column}>
            <h3 style={styles.heading}>Follow Us</h3>
            <div style={styles.socials}>
              <a href="#" style={styles.socialLink}><Facebook /></a>
              <a href="#" style={styles.socialLink}><Twitter /></a>
              <a href="#" style={styles.socialLink}><Linkedin /></a>
            </div>
          </div>
        </div>
        <div style={styles.bottomBar}>
          <p>&copy; 2024 CivicBridge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '60px 0 0',
    marginTop: 'auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  column: {
    
  },
  heading: {
    fontSize: '18px',
    marginBottom: '20px',
    fontWeight: '600'
  },
  tagline: {
    fontSize: '14px',
    opacity: 0.8,
    lineHeight: '1.6'
  },
  linkList: {
    listStyle: 'none',
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'opacity 0.3s',
    lineHeight: '2'
  },
  socials: {
    display: 'flex',
    gap: '15px'
  },
  socialLink: {
    color: 'white',
    opacity: 0.8,
    transition: 'opacity 0.3s'
  },
  bottomBar: {
    padding: '20px 0',
    textAlign: 'center',
    borderTop: '1px solid #374151'
  }
};

export default Footer;
