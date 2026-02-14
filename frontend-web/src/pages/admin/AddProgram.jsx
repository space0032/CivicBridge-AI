import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../services/api';

const AddProgram = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        contactInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Program name is required";
        if (!formData.description.trim()) return "Description is required";
        if (formData.description.length < 20) return "Description should be at least 20 characters";
        if (formData.applicationDeadline) {
            const today = new Date().toISOString().split('T')[0];
            if (formData.applicationDeadline < today) return "Deadline cannot be in the past";
        }
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
            setLoading(true);
            setError(null);
            await programService.create(formData);
            navigate('/admin');
        } catch (err) {
            setError('Failed to create program. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button onClick={() => navigate('/admin')} style={styles.backButton}>
                    &larr; Back to Dashboard
                </button>
                <div style={styles.header}>
                    <h1 style={styles.title}>Add New Program</h1>
                    <p style={styles.subtitle}>Fill in the details to add a new government program to the platform.</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Program Name *</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} placeholder="e.g. PM Kisan Samman Nidhi" />
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
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required style={{ ...styles.input, height: '100px' }} placeholder="Brief overview of the program..."></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="region" style={styles.label}>Region</label>
                        <input id="region" type="text" name="region" value={formData.region} onChange={handleChange} style={styles.input} placeholder="e.g. Maharashtra, All India" />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="eligibilityCriteria" style={styles.label}>Eligibility Criteria</label>
                        <textarea id="eligibilityCriteria" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} style={styles.input} placeholder="Who can apply?"></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="applicationDeadline" style={styles.label}>Application Deadline</label>
                        <input id="applicationDeadline" type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} style={styles.input} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={styles.submitButton} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Program'}
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

export default AddProgram;
