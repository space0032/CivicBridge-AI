import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { voiceService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Mic, Calendar } from 'lucide-react';
import logger from '../utils/logger';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await voiceService.getHistory(user.id);
                setHistory(response.data?.data || []);
            } catch (err) {
                logger.error('Failed to load history', err);
            } finally {
                setLoading(false);
            }
        };

        if (!user) {
            navigate('/login');
            return;
        }

        fetchHistory();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="container" style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <p style={styles.subtitle}>Manage your account and view your activity.</p>
            </div>

            <div style={styles.grid}>
                <div style={styles.profileCard}>
                    <div style={styles.profileHeader}>
                        <div style={styles.avatar}>
                            <User size={40} color="white" />
                        </div>
                        <div>
                            <h2 style={styles.name}>{user.name || user.fullName || 'User'}</h2>
                            <p style={styles.role}>{user.role || 'Community Member'}</p>
                        </div>
                    </div>

                    <div style={styles.infoSection}>
                        <p><strong>Username:</strong> {user.username}</p>
                        {user.email && <p><strong>Email:</strong> {user.email}</p>}
                    </div>

                    <button onClick={handleLogout} className="btn" style={styles.logoutButton}>
                        Logout
                    </button>
                </div>

                <div style={styles.historySection}>
                    <h2 style={styles.sectionTitle}>Voice Search History</h2>
                    {loading ? (
                        <p>Loading history...</p>
                    ) : history.length > 0 ? (
                        <div style={styles.historyList}>
                            {history.map((item, index) => (
                                <div key={item.id || index} style={styles.historyItem}>
                                    <div style={styles.historyIcon}><Mic size={18} /></div>
                                    <div style={styles.historyContent}>
                                        <p style={styles.query}>&quot;{item.queryText}&quot;</p>
                                        <div style={styles.meta}>
                                            <span style={styles.date}>
                                                <Calendar size={14} style={{ marginRight: '4px' }} />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.emptyState}>
                            <p>No search history yet.</p>
                            <button onClick={() => navigate('/voice-search')} style={styles.linkButton}>
                                Try Voice Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        paddingTop: '40px',
        paddingBottom: '40px',
        maxWidth: '1000px',
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
        gridTemplateColumns: '300px 1fr',
        gap: '30px',
        alignItems: 'start'
    },
    profileCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
    },
    profileHeader: {
        marginBottom: '20px'
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px'
    },
    name: {
        fontSize: '22px',
        margin: '0 0 5px 0',
        color: '#1f2937'
    },
    role: {
        color: '#6b7280',
        margin: 0
    },
    infoSection: {
        marginBottom: '20px',
        color: '#374151',
        textAlign: 'left'
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        width: '100%'
    },
    historySection: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '20px',
        color: '#1f2937',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '10px'
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    historyItem: {
        display: 'flex',
        gap: '15px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    historyIcon: {
        color: '#2563eb',
        marginTop: '2px'
    },
    historyContent: {
        flex: 1
    },
    query: {
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: '5px'
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        color: '#6b7280'
    },
    date: {
        display: 'flex',
        alignItems: 'center'
    },
    emptyState: {
        textAlign: 'center',
        padding: '20px',
        color: '#6b7280'
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#2563eb',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px'
    }
};

export default Profile;
