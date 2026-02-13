import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { sanitize, sanitizeObject } from '../utils/sanitize';

const Register = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: sanitize(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);

            const sanitizedData = sanitizeObject(formData);
            const payload = {
                ...sanitizedData,
                preferredLanguage: i18n.language || 'en',
                region: 'Universal' // Default for new users
            };

            // Register
            await authService.register(payload);
            // Automatically login after successful registration
            await login({
                username: sanitizedData.username,
                password: sanitizedData.password
            });
            navigate('/');
        } catch (err) {
            setError(t('error') + ': ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{t('create_account')}</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={styles.formGroup}>
                        <label style={styles.label}>{t('full_name')}</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div className="form-group" style={styles.formGroup}>
                        <label style={styles.label}>{t('email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div className="form-group" style={styles.formGroup}>
                        <label style={styles.label}>{t('username')}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div className="form-group" style={styles.formGroup}>
                        <label style={styles.label}>{t('password')}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button disabled={loading} type="submit" className="btn btn-primary" style={styles.button}>
                        {loading ? t('creating_account') : t('register')}
                    </button>
                </form>
                <div style={styles.footer}>
                    {t('already_have_account')} <Link to="/login">{t('login_link')}</Link>
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

export default Register;
