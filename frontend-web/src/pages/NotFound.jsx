import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="container" style={styles.container}>
            <AlertTriangle size={64} color="#f59e0b" style={{ marginBottom: '20px' }} />
            <h1 style={styles.title}>404 - Page Not Found</h1>
            <p style={styles.message}>
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <Link to="/" className="btn btn-primary" style={styles.link}>
                Go to Homepage
            </Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '20px'
    },
    title: {
        fontSize: '36px',
        color: '#1f2937',
        marginBottom: '10px'
    },
    message: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '30px',
        maxWidth: '500px'
    },
    link: {
        padding: '12px 24px',
        textDecoration: 'none'
    }
};

export default NotFound;
