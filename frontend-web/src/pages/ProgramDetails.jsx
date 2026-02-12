import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

import { programService } from '../services/api';

const ProgramDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                setLoading(true);
                const response = await programService.getById(id);
                setProgram(response.data.data);
                setError(null);
            } catch (err) {
                setError(t('error_loading_program'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, [id]);

    const handleApply = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Proceed with application logic or show a message
        alert(t('application_started') || "Application started!");
    };

    if (loading) return <div className="container" style={styles.container}>{t('loading')}</div>;
    if (error) return <div className="container" style={styles.container}><p style={styles.error}>{error}</p></div>;
    if (!program) return <div className="container" style={styles.container}>{t('program_not_found')}</div>;

    return (
        <div className="container" style={styles.container}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
                &larr; {t('back_to_programs')}
            </button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>{program.name}</h1>
                    <span style={styles.badge}>{program.category}</span>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>{t('description')}</h3>
                    <p style={styles.text}>{program.description}</p>
                </div>

                <div style={styles.grid}>
                    {program.region && (
                        <div style={styles.infoItem}>
                            <h4 style={styles.label}>{t('region')}</h4>
                            <p>{program.region}</p>
                        </div>
                    )}
                    {program.applicationDeadline && (
                        <div style={styles.infoItem}>
                            <h4 style={styles.label}>{t('application_deadline')}</h4>
                            <p style={styles.deadline}>{program.applicationDeadline}</p>
                        </div>
                    )}
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>{t('eligibility_criteria')}</h3>
                    <p style={styles.text}>{program.eligibilityCriteria}</p>
                </div>

                {program.benefits && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>{t('benefits')}</h3>
                        <p style={styles.text}>{program.benefits}</p>
                    </div>
                )}

                {program.applicationProcess && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>{t('how_to_apply')}</h3>
                        <p style={styles.text}>{program.applicationProcess}</p>
                    </div>
                )}

                {program.contactInfo && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>{t('contact_information')}</h3>
                        <p style={styles.text}>{program.contactInfo}</p>
                    </div>
                )}

                <div style={styles.actions}>
                    <button className="btn btn-primary" style={styles.applyButton} onClick={handleApply}>
                        {t('apply_now')}
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
    badge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px'
    },
    infoItem: {
        marginBottom: '10px'
    },
    label: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '4px'
    },
    deadline: {
        color: '#dc2626',
        fontWeight: '500'
    },
    actions: {
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    applyButton: {
        fontSize: '18px',
        padding: '12px 24px'
    },
    error: {
        color: '#dc2626'
    }
};

export default ProgramDetails;
