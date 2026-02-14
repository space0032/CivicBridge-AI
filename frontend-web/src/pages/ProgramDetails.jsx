import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { programService } from '../services/api';
import { Calendar, MapPin, Info, CheckCircle, Award, FileText, Phone } from 'lucide-react';

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
                setProgram(response.data?.data);
                setError(null);
            } catch (err) {
                setError(t('error_loading_program'));
                toast.error(t('error_loading_program'));
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, [id, t]);

    const handleApply = () => {
        if (!user) {
            toast.error(t('login_required'));
            navigate('/login');
            return;
        }
        navigate(`/apply/${id}`);
    };

    if (loading) return <div className="container" style={styles.container}><p>Loading...</p></div>;
    if (error) return <div className="container" style={styles.container}><p style={styles.error}>{error}</p></div>;
    if (!program) return <div className="container" style={styles.container}><p>{t('program_not_found')}</p></div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    &larr; {t('back_to_programs')}
                </button>

                <div style={styles.header}>
                    <h1 style={styles.title}>{program.name}</h1>
                    <span style={styles.badge}>{program.category}</span>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}><Info size={20} style={styles.icon} /> {t('description')}</h3>
                    <p style={styles.text}>{program.description}</p>
                </div>

                <div style={styles.grid}>
                    {program.region && <InfoCard icon={<MapPin />} label={t('region')} value={program.region} />}
                    {program.applicationDeadline && <InfoCard icon={<Calendar />} label={t('application_deadline')} value={program.applicationDeadline} deadline />}
                </div>

                {program.eligibilityCriteria && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}><CheckCircle size={20} style={styles.icon} /> {t('eligibility_criteria')}</h3>
                        <p style={styles.text}>{program.eligibilityCriteria}</p>
                    </div>
                )}

                {program.benefits && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}><Award size={20} style={styles.icon} /> {t('benefits')}</h3>
                        <p style={styles.text}>{program.benefits}</p>
                    </div>
                )}

                {program.applicationProcess && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}><FileText size={20} style={styles.icon} /> {t('how_to_apply')}</h3>
                        <p style={styles.text}>{program.applicationProcess}</p>
                    </div>
                )}

                {program.contactInfo && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}><Phone size={20} style={styles.icon} /> {t('contact_information')}</h3>
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

const InfoCard = ({ icon, label, value, deadline }) => (
    <div style={styles.infoItem}>
        <div style={styles.infoIcon}>{icon}</div>
        <div>
            <h4 style={styles.label}>{label}</h4>
            <p style={deadline ? styles.deadline : {}}>{value}</p>
        </div>
    </div>
);

const styles = {
    container: {
        padding: '40px 20px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: '0 auto'
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '16px'
    },
    header: {
        marginBottom: '30px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '20px'
    },
    title: {
        fontSize: '32px',
        color: '#1f2937',
        marginBottom: '15px'
    },
    badge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'inline-block'
    },
    section: {
        marginBottom: '30px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        marginRight: '10px',
        color: '#6b7280'
    },
    text: {
        color: '#4b5563',
        lineHeight: '1.7'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    },
    infoItem: {
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    infoIcon: {
        color: '#2563eb'
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
        padding: '12px 30px'
    },
    error: {
        color: '#dc2626',
        textAlign: 'center'
    }
};

export default ProgramDetails;
