import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { healthcareService } from '../services/api';
import { MapPin, Phone, Clock } from 'lucide-react';
import logger from '../utils/logger';

const HealthcareDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacilityDetails = async () => {
            try {
                setLoading(true);
                const response = await healthcareService.getById(id);
                if (response && response.data && response.data.data) {
                    setFacility(response.data.data);
                } else {
                    throw new Error('Invalid API response structure');
                }
                setError(null);
            } catch (err) {
                setError(t('error_loading_facility'));
                logger.error('Failed to load healthcare facility details', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilityDetails();
    }, [id, t]);

    const getDirections = () => {
        if (facility && facility.latitude && facility.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`, '_blank');
        } else if (facility && facility.address) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`, '_blank');
        }
    };

    if (loading) return <div className="container" style={styles.container}>{t('loading')}</div>;
    if (error) return <div className="container" style={styles.container}><p style={styles.error}>{error}</p></div>;
    if (!facility) return <div className="container" style={styles.container}>{t('facility_not_found')}</div>;

    return (
        <div className="container" style={styles.container}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
                &larr; {t('back_to_healthcare')}
            </button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>{facility.name}</h1>
                    <div style={styles.badges}>
                        <span style={styles.badge}>{facility.type}</span>
                        {facility.freeServices && (
                            <span style={styles.freeBadge}>{t('free_services_only')}</span>
                        )}
                    </div>
                </div>

                <div style={styles.grid}>
                    {facility.address && (
                        <div style={styles.infoItem}>
                            <div style={styles.iconWrapper}><MapPin size={20} /></div>
                            <p>{facility.address}</p>
                        </div>
                    )}
                    {facility.contactNumber && (
                        <div style={styles.infoItem}>
                            <div style={styles.iconWrapper}><Phone size={20} /></div>
                            <p>{facility.contactNumber}</p>
                        </div>
                    )}
                    {facility.operatingHours && (
                        <div style={styles.infoItem}>
                            <div style={styles.iconWrapper}><Clock size={20} /></div>
                            <p>{facility.operatingHours}</p>
                        </div>
                    )}
                </div>

                {facility.services && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>{t('services_offered')}</h3>
                        <p style={styles.text}>{facility.services}</p>
                    </div>
                )}

                <div style={styles.actions}>
                    <button
                        className="btn btn-primary"
                        style={styles.directionsButton}
                        onClick={getDirections}
                    >
                        {t('get_directions')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        paddingTop: '40px',
        paddingBottom: '40px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    header: {
        marginBottom: '30px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '20px'
    },
    title: {
        fontSize: '32px',
        color: '#1f2937',
        marginBottom: '10px'
    },
    badges: {
        display: 'flex',
        gap: '10px'
    },
    badge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500'
    },
    freeBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500'
    },
    section: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '10px'
    },
    text: {
        color: '#4b5563',
        lineHeight: '1.6'
    },
    grid: {
        display: 'grid',
        gap: '20px',
        marginBottom: '30px',
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px'
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    iconWrapper: {
        color: '#6b7280'
    },
    actions: {
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    directionsButton: {
        fontSize: '18px',
        padding: '12px 24px'
    },
    error: {
        color: '#dc2626'
    }
};

export default HealthcareDetails;
