import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { programService } from '../../services/api';

const EditProgram = () => {
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
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Program Name *</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="category" style={styles.label}>Category *</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} style={styles.input}>
                            <option value="AGRICULTURE">Agriculture</option>
                            <option value="EDUCATION">Education</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="EMPLOYMENT">Employment</option>
                            <option value="HOUSING">Housing</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="description" style={styles.label}>Description *</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required style={{ ...styles.input, height: '100px' }}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="region" style={styles.label}>Region</label>
                        <input id="region" type="text" name="region" value={formData.region} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="eligibilityCriteria" style={styles.label}>Eligibility Criteria</label>
                        <textarea id="eligibilityCriteria" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="benefits" style={styles.label}>Benefits</label>
                        <textarea id="benefits" name="benefits" value={formData.benefits} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="applicationProcess" style={styles.label}>Application Process</label>
                        <textarea id="applicationProcess" name="applicationProcess" value={formData.applicationProcess} onChange={handleChange} style={styles.input}></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="applicationDeadline" style={styles.label}>Application Deadline</label>
                        <input id="applicationDeadline" type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="contactInfo" style={styles.label}>Contact Info</label>
                        <input id="contactInfo" type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.checkboxLabel}>
                            <input id="isActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} style={styles.checkbox} />
                            Is Active?
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={styles.submitButton} disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Program'}
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
    }
};

export default EditProgram;
