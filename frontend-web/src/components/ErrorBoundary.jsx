import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger';
import { AlertTriangle } from 'lucide-react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const errorHandler = (error, errorInfo) => {
            logger.error("Uncaught error:", error, errorInfo);
            setHasError(true);
        };

        window.addEventListener('error', errorHandler);
        return () => window.removeEventListener('error', errorHandler);
    }, []);

    if (hasError) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <AlertTriangle size={64} color="#dc2626" style={{ marginBottom: '20px' }} />
                    <h1 style={styles.title}>{t('something_went_wrong')}</h1>
                    <p style={styles.message}>{t('unexpected_error')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={styles.button}
                    >
                        {t('refresh_page')}
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
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
    button: {
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default ErrorBoundary;
