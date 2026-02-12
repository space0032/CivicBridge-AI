import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary" style={styles.button}>
            {loading ? t('logging_in') : t('login')}
          </button>
        </form>
        <div style={styles.footer}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
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
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1f2937'
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
    padding: '10px',
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
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  }
};

export default Login;
