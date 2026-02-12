import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
// Assuming authService is exported from api.js directly, or we can use a register function from context if added.
// Looking at AuthContext, it only has login. I'll use authService directly for registration then login.

const Register = () => {
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            // Register
            await authService.register(formData);
            // Automatically login after successful registration
            await login({ username: formData.username, password: formData.password });
            navigate('/');
        } catch (err) {
            setError('Failed to create an account. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
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
                        <label style={styles.label}>Email</label>
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
                        <label style={styles.label}>Username</label>
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
                        <label style={styles.label}>Password</label>
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
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <div style={styles.footer}>
                    Already have an account? <Link to="/login">Login</Link>
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
