import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { applicationService } from '../services/api';
import toast from 'react-hot-toast';
import { FileText, Calendar } from 'lucide-react';

const MyApplications = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await applicationService.getAll();
        setApplications(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(t('error_loading_applications'));
        toast.error(t('error_loading_applications'));
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [t]);

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return styles.statusPending;
      case 'APPROVED': return styles.statusApproved;
      case 'REJECTED': return styles.statusRejected;
      default: return {};
    }
  };

  if (loading) return <div className="container" style={styles.container}><p>Loading applications...</p></div>;
  if (error) return <div className="container" style={styles.container}><p style={styles.error}>{error}</p></div>;

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{t('my_applications')}</h1>
        <p style={styles.subtitle}>Track the status of all your submitted applications.</p>
      </div>

      {applications.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={48} color="#9ca3af" />
          <p>{t('no_applications_found')}</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {applications.map((app) => (
            <div key={app.id} style={styles.card}>
              <h3 style={styles.programName}>{app.program.name}</h3>
              <div style={styles.details}>
                <span style={{...styles.status, ...getStatusStyle(app.status)}}>
                  {app.status}
                </span>
                <span style={styles.date}>
                  <Calendar size={14} style={{ marginRight: '5px' }} />
                  {t('submitted_on')}: {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
        paddingTop: '40px',
        paddingBottom: '40px',
        maxWidth: '900px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '36px',
        color: '#1f2937',
        marginBottom: '10px'
    },
    subtitle: {
        fontSize: '18px',
        color: '#6b7280'
    },
    grid: {
        display: 'grid',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
    },
    programName: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '15px',
        color: '#1f2937'
    },
    details: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    status: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        textTransform: 'uppercase'
    },
    statusPending: {
        backgroundColor: '#fef3c7',
        color: '#92400e'
    },
    statusApproved: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    statusRejected: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },
    date: {
        fontSize: '14px',
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center'
    },
    error: {
        color: '#dc2626',
        textAlign: 'center'
    },
    emptyState: {
        textAlign: 'center',
        padding: '50px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px dashed #d1d5db',
        color: '#6b7280'
    }
};

export default MyApplications;
