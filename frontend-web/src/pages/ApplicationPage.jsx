import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { programService, applicationService } from '../services/api';

const ApplicationPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    // Additional fields can be added here
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('login_required'));
      navigate('/login');
      return;
    }

    setSubmitLoading(true);
    try {
      await applicationService.submit({
        programId: id,
        ...formData,
      });
      toast.success(t('application_submitted'));
      navigate('/applications');
    } catch (err) {
      toast.error(t('error_submitting_application'));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="container" style={styles.container}><p>Loading...</p></div>;
  if (error) return <div className="container" style={styles.container}><p style={styles.error}>{error}</p></div>;
  if (!program) return <div className="container" style={styles.container}><p>{t('program_not_found')}</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t('apply_for')}</h1>
          <h2 style={styles.programName}>{program.name}</h2>
          <p style={styles.subtitle}>Please fill out the form below to submit your application.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>{t('full_name')}</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>{t('email_address')}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.input} required />
          </div>
          {/* Add more dynamic fields based on program requirements if available */}
          <button type="submit" className="btn btn-primary" style={styles.submitButton} disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : t('submit_application')}
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
        maxWidth: '700px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        fontSize: '20px',
        color: '#6b7280',
        fontWeight: '500'
    },
    programName: {
        fontSize: '28px',
        color: '#1f2937',
        margin: '5px 0'
    },
    subtitle: {
        color: '#6b7280',
        marginTop: '10px'
    },
    formGroup: {
        marginBottom: '20px'
    },
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
        width: '100%',
        padding: '12px',
        fontSize: '18px',
        marginTop: '10px'
    },
    error: {
        color: '#dc2626',
        textAlign: 'center'
    }
};

export default ApplicationPage;
