import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className="container" style={styles.container}>
            <AlertTriangle size={64} color="#f59e0b" style={{ marginBottom: '20px' }} />
            <h1 style={styles.title}>{t('not_found_title')}</h1>
            <p style={styles.message}>
                {t('not_found_message')}
            </p>
            <Link to="/" className="btn btn-primary" style={styles.link}>
                {t('go_to_homepage')}
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
