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
                region: 'Universal'
            };

            await authService.register(payload);
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
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>{t('create_account')}</h1>
                    <p style={styles.subtitle}>Join our community to access all features.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="fullName" style={styles.label}>{t('full_name')}</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>{t('email')}</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>{t('username')}</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
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
                    {t('already_have_account')}{' '}
                    <Link to="/login" style={styles.link}>{t('login')}</Link>
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
        padding: '40px 20px'
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

export default Register;
