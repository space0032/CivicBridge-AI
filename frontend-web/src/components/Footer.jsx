

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <p>&copy; 2024 CivicBridge AI. All rights reserved.</p>
        <p style={styles.tagline}>
          Empowering communities through accessible civic resources
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '20px 0',
    marginTop: '40px',
    textAlign: 'center'
  },
  tagline: {
    fontSize: '14px',
    marginTop: '5px',
    opacity: 0.8
  }
};

export default Footer;
