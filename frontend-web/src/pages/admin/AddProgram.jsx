import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programService } from '../../services/api';

const AddProgram = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'AGRICULTURE', // default
        description: '',
        region: '',
        eligibilityCriteria: '',
        applicationDeadline: '', // YYYY-MM-DD
        benefits: '',
        applicationProcess: '',
        contactInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await programService.create(formData);
            navigate('/admin'); // Return to dashboard
        } catch (err) {
            setError('Failed to create program. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={styles.container}>
            <button onClick={() => navigate('/admin')} style={styles.backButton}>
                &larr; Back to Dashboard
            </button>

            <div style={styles.card}>
                <h1 style={styles.title}>Add New Program</h1>
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="form-group">
                        <label style={styles.label}>Program Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="e.g. PM Kisan Samman Nidhi"
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="AGRICULTURE">Agriculture</option>
                            <option value="EDUCATION">Education</option>
                            <option value="HEALTHCARE">Healthcare</option>
                            <option value="EMPLOYMENT">Employment</option>
                            <option value="HOUSING">Housing</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, height: '100px' }}
                            placeholder="Brief overview of the program..."
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Region</label>
                        <input
                            type="text"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. Maharashtra, All India"
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Eligibility Criteria</label>
                        <textarea
                            name="eligibilityCriteria"
                            value={formData.eligibilityCriteria}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Who can apply?"
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Application Deadline</label>
                        <input
                            type="date"
                            name="applicationDeadline"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Program'}
                    </button>
                </form>
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
        marginBottom: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    title: {
        fontSize: '28px',
        marginBottom: '30px',
        color: '#1f2937'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#374151'
    },
    input: {
        width: '100%',
        padding: '10px',
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
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    }
};

export default AddProgram;
