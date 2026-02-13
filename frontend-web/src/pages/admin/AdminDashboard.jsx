import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, FileText, Heart, Activity } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalPrograms: 0,
        totalHealthcareFacilities: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchInitialStats = async () => {
            try {
                const response = await adminService.getStats();
                setDashboardStats(response.data);
            } catch (error) {
                console.error("Failed to fetch initial stats", error);
            }
        };

        if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
            fetchInitialStats();

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const wsUrl = baseUrl.replace('/api', '/ws');
            const socket = new SockJS(wsUrl);
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, () => {
                stompClient.subscribe('/topic/stats', (message) => {
                    const updatedStats = JSON.parse(message.body);
                    setDashboardStats(updatedStats);
                });
            }, (err) => {
                console.error("STOMP error", err);
            });

            return () => {
                if (stompClient && stompClient.connected) {
                    stompClient.disconnect();
                }
            };
        }
    }, [user]);

    const stats = [
        { label: 'Total Programs', value: dashboardStats.totalPrograms, icon: <FileText size={24} color="#2563eb" /> },
        { label: 'Healthcare Facilities', value: dashboardStats.totalHealthcareFacilities, icon: <Heart size={24} color="#dc2626" /> },
        { label: 'Active Users', value: dashboardStats.totalUsers, icon: <Activity size={24} color="#059669" /> },
    ];

    if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
        return (
            <div className="container" style={styles.container}>
                <div style={styles.accessDenied}>
                    <h2 style={{ color: '#dc2626' }}>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                    <Link to="/" className="btn" style={{ marginTop: '20px', display: 'inline-block', color: '#2563eb' }}>Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={styles.container}>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {user.name}</p>

            <div style={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={styles.statIcon}>{stat.icon}</div>
                        <div style={styles.statContent}>
                            <h3 style={styles.statValue}>{stat.value}</h3>
                            <p style={styles.statLabel}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.actionsSection}>
                <h2 style={styles.sectionTitle}>Content Management</h2>
                <div style={styles.actionGrid}>
                    <Link to="/admin/add-program" style={styles.actionCard}>
                        <PlusCircle size={32} style={styles.actionIcon} />
                        <h3>Add Program</h3>
                        <p>Create a new government scheme or subsidy listing</p>
                    </Link>

                    <Link to="/admin/add-healthcare" style={styles.actionCard}>
                        <PlusCircle size={32} style={styles.actionIcon} />
                        <h3>Add Healthcare Facility</h3>
                        <p>Register a new hospital, clinic, or vaccination center</p>
                    </Link>
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
    title: {
        fontSize: '32px',
        color: '#1f2937',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#6b7280',
        marginBottom: '40px',
        fontSize: '18px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    statIcon: {
        padding: '10px',
        backgroundColor: '#f3f4f6',
        borderRadius: '50%'
    },
    statContent: {
        flex: 1
    },
    statValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: 0
    },
    statLabel: {
        color: '#6b7280',
        fontSize: '14px',
        margin: 0
    },
    actionsSection: {
        marginTop: '40px'
    },
    sectionTitle: {
        fontSize: '24px',
        color: '#1f2937',
        marginBottom: '20px'
    },
    actionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
    },
    actionCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid #e5e7eb'
    },
    actionIcon: {
        color: '#2563eb',
        marginBottom: '15px'
    }
};

export default AdminDashboard;
