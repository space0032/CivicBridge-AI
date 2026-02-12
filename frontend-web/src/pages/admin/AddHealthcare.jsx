import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthcareService } from '../../services/api';

const AddHealthcare = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'HOSPITAL',
        address: '',
        latitude: '',
        longitude: '',
        contactNumber: '',
        operatingHours: '',
        services: '',
        freeServices: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await healthcareService.create(formData);
            navigate('/admin');
        } catch (err) {
            setError('Failed to create facility. ' + (err.response?.data?.message || err.message));
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
                <h1 style={styles.title}>Add Healthcare Facility</h1>
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="form-group">
                        <label style={styles.label}>Facility Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="HOSPITAL">Hospital</option>
                            <option value="CLINIC">Clinic</option>
                            <option value="VACCINATION_CENTER">Vaccination Center</option>
                            <option value="PHARMACY">Pharmacy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, height: '80px' }}
                        />
                    </div>

                    <div style={styles.row}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={styles.label}>Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="e.g. 19.0760"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={styles.label}>Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="e.g. 72.8777"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Operating Hours</label>
                        <input
                            type="text"
                            name="operatingHours"
                            value={formData.operatingHours}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. Mon-Sat 9am-6pm"
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.label}>Services (comma separated)</label>
                        <textarea
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. General Medicine, Pediatrics, X-Ray"
                        />
                    </div>

                    <div className="form-group">
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="freeServices"
                                checked={formData.freeServices}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            Offers Free Services?
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Facility'}
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
    row: {
        display: 'flex',
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
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    }
};

export default AddHealthcare;
