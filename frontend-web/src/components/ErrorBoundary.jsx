import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger';

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
            <div style={{
                padding: '40px',
                textAlign: 'center',
                marginTop: '50px',
                fontFamily: 'sans-serif'
            }}>
                <h1>{t('something_went_wrong')}</h1>
                <p>{t('unexpected_error')}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    {t('refresh_page')}
                </button>
            </div>
        );
    }

    return children;
};

export default ErrorBoundary;
