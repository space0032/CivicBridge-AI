import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { programService } from '../../services/api';

import { useTranslation } from 'react-i18next';

const EditProgram = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'AGRICULTURE',
        description: '',
        region: '',
        eligibilityCriteria: '',
        applicationDeadline: '',
        benefits: '',
        applicationProcess: '',
        contactInfo: '',
        isActive: true
    });

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await programService.getById(id);
                const program = response.data.data;
                setFormData({
                    name: program.name || '',
                    category: program.category || 'AGRICULTURE',
                    description: program.description || '',
                    region: program.region || '',
                    eligibilityCriteria: program.eligibilityCriteria || '',
                    applicationDeadline: program.applicationDeadline || '',
                    benefits: program.benefits || '',
                    applicationProcess: program.applicationProcess || '',
                    contactInfo: program.contactInfo || '',
                    isActive: program.isActive !== undefined ? program.isActive : true
                });
            } catch (err) {
                setError('Failed to fetch program details. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Program name is required";
        if (!formData.description.trim()) return "Description is required";
        if (formData.description.length < 20) return "Description should be at least 20 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await programService.update(id, formData);
            navigate('/admin');
        } catch (err) {
            setError('Failed to update program. ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={styles.container}>Loading...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button onClick={() => navigate('/admin')} style={styles.backButton}>
                    &larr; Back to Dashboard
                </button>
                <div style={styles.header}>
                    <h1 style={styles.title}>Edit Program</h1>
                    <p style={styles.subtitle}>Modify the details of the government program.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* ... form fields ... */}
                    {/* Simplified for brevity, I should replace the button part mostly but instruction says "Single Contiguous Block" */}
                    {/* I will replace the button block and maybe the whole form if I need to localize labels too. */}
                    {/* The user wants localized labels. I need to update labels to use t() */}

                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>{t('program_name')} *</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="category" style={styles.label}>{t('category')} *</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                            <option value="AGRICULTURE">{t('agriculture')}</option>
                            <option value="EDUCATION">{t('education')}</option>
                            <option value="HEALTHCARE">{t('healthcare')}</option>
                            <option value="EMPLOYMENT">{t('employment')}</option>
                            <option value="HOUSING">{t('housing')}</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="description" style={styles.label}>{t('description')} *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required style={{ ...styles.input, height: '100px' }}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="region" style={styles.label}>{t('region')}</label>
                        <input id="region" type="text" name="region" value={formData.region} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="eligibilityCriteria" style={styles.label}>{t('eligibility_criteria')}</label>
                        <textarea id="eligibilityCriteria" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="benefits" style={styles.label}>{t('benefits')}</label>
                        <textarea id="benefits" name="benefits" value={formData.benefits} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="applicationProcess" style={styles.label}>{t('application_process')}</label>
                        <textarea id="applicationProcess" name="applicationProcess" value={formData.applicationProcess} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="applicationDeadline" style={styles.label}>{t('application_deadline')}</label>
                        <input id="applicationDeadline" type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="contactInfo" style={styles.label}>{t('contact_info')}</label>
                        <input id="contactInfo" type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.checkboxLabel}>
                            <input id="isActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={styles.checkbox} />
                            {t('is_active')}
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={styles.submitButton} disabled={submitting}>
                        {submitting ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div className="spinner" style={styles.spinner}></div>
                                {t('updating')}
                            </span>
                        ) : t('update_program')}
                    </button>
                </form>
            </div>
        </div>
    );
};

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
    header: {
        marginBottom: '30px'
    },
    title: {
        fontSize: '28px',
        color: '#1f2937'
    },
    subtitle: {
        color: '#6b7280',
        marginTop: '5px'
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '16px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {},
    label: {
        display: 'block',
        marginBottom: '8px',
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
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    checkbox: {
        width: '18px',
        height: '18px'
    },
    submitButton: {
        marginTop: '20px',
        padding: '12px'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTop: '3px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }
};

// Add global style for keyframes if not present, or use a separate CSS file.
// Ideally should be in index.css, but for this task I'll inline the style tag 
// or assume 'spin' animation exists? 
// The user asked for "Add a global or localized spinner".
// I'll add a style tag injection for now or just rely on standard keyframes if they existed.
// But to be safe, I've added a style tag in the component render? No that's bad practice.
// I'll just add the keyframes to index.css later or here? 
// I'll stick to just the object styles and hope local CSS handles it or I'll add a <style> block.
// Wait, I can't add a <style> block easily inside the styles object.
// I will just add the spinner style and assume I can add the keyframes globally.

/* 
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
} 
*/
// I'll need to make sure this animation exists. I'll check index.css next.

export default EditProgram;
