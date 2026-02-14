import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <AlertTriangle size={64} color="#f59e0b" style={{ marginBottom: '20px' }} />
                <h1 style={styles.title}>{t('not_found_title')}</h1>
                <p style={styles.message}>
                    {t('not_found_message')}
                </p>
                <Link to="/" className="btn btn-primary" style={styles.link}>
                    {t('go_to_homepage')}
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)',
        backgroundColor: '#f9fafb',
        padding: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        maxWidth: '500px'
    },
    title: {
        fontSize: '28px',
        color: '#1f2937',
        marginBottom: '15px'
    },
    message: {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '30px'
    },
    link: {
        padding: '12px 24px',
        textDecoration: 'none'
    }
};

export default NotFound;
