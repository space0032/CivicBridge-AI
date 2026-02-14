import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { sanitize } from '../utils/sanitize';

const Login = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: sanitize(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t('login')}</h1>
          <p style={styles.subtitle}>Access your account to get started.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>{t('username')}</label>
            <input
              id="username"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>{t('password')}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary" style={styles.button} aria-label={loading ? t('logging_in') : t('login')}>
            {loading ? t('logging_in') : t('login')}
          </button>
        </form>

        <div style={styles.footer}>
          {t('no_account')}{' '}
          <Link to="/register" style={styles.link} aria-label={t('register')}>{t('register')}</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 140px)',
    backgroundColor: '#f9fafb',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  subtitle: {
    marginTop: '5px',
    color: '#6b7280'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    marginTop: '10px'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  footer: {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default Login;
