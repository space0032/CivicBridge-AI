import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { voiceService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Mic, Calendar } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchHistory();
    }, [user, navigate]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // Assuming user.id exists. If using demoUser, it has id: 1
            const response = await voiceService.getHistory(user.id);
            setHistory(response.data.data || []);
        } catch (err) {
            console.error('Failed to load history', err);
            // Don't show error to user, just show empty history or keep loading false
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="container" style={styles.container}>
            <div style={styles.profileCard}>
                <div style={styles.profileHeader}>
                    <div style={styles.avatar}>
                        <User size={40} color="white" />
                    </div>
                    <div>
                        <h1 style={styles.name}>{user.name || user.fullName || 'User'}</h1>
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
                                <div style={styles.historyIcon}>
                                    <Mic size={18} />
                                </div>
                                <div style={styles.historyContent}>
                                    <p style={styles.query}>"{item.queryText}"</p>
                                    <div style={styles.meta}>
                                        <span style={styles.date}>
                                            <Calendar size={14} style={{ marginRight: '4px' }} />
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </span>
                                        {item.responseSummary && (
                                            <span style={styles.response}> • {item.responseSummary}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <p>No search history yet.</p>
                        <button
                            onClick={() => navigate('/voice-search')}
                            style={styles.linkButton}
                        >
                            Try Voice Search
                        </button>
                    </div>
                )}
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
    profileCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    profileHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        marginBottom: '15px'
    },
    name: {
        fontSize: '24px',
        margin: '0 0 5px 0',
        color: '#1f2937'
    },
    role: {
        color: '#6b7280',
        margin: 0
    },
    infoSection: {
        marginBottom: '20px',
        color: '#374151'
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '8px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
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
        borderRadius: '8px',
        alignItems: 'flex-start'
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
    response: {
        marginLeft: '5px',
        color: '#4b5563'
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
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px'
    }
};

export default Profile;
