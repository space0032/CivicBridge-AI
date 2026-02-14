import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, FileText, Heart, Activity } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { adminService, programService, healthcareService } from '../../services/api';
import { Edit2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalPrograms: 0,
        totalHealthcareFacilities: 0,
        totalUsers: 0
    });
    const [programs, setPrograms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoadingLists(true);
                const [statsRes, programsRes, facilitiesRes] = await Promise.all([
                    adminService.getStats(),
                    programService.getAll(),
                    healthcareService.getAll()
                ]);
                setDashboardStats(statsRes.data);
                setPrograms(programsRes.data.data || []);
                setFacilities(facilitiesRes.data.data || []);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoadingLists(false);
            }
        };

        if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
            fetchInitialData();

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const wsUrl = `${baseUrl}/ws`;
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

    const isProgramActive = (deadline) => {
        if (!deadline) return true;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        return deadline >= todayStr;
    };

    return (
        <div className="container" style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <p style={styles.subtitle}>Welcome back, {user.name}. Here&apos;s a real-time overview of the platform.</p>
            </div>

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
                        <p>Create a new government scheme or subsidy listing.</p>
                    </Link>

                    <Link to="/admin/add-healthcare" style={styles.actionCard}>
                        <PlusCircle size={32} style={styles.actionIcon} />
                        <h3>Add Healthcare Facility</h3>
                        <p>Register a new hospital, clinic, or vaccination center.</p>
                    </Link>
                </div>
            </div>

            <div style={styles.managementSection}>
                <h2 style={styles.sectionTitle}>Manage Programs</h2>
                {loadingLists ? <p>Loading programs...</p> : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Region</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map(program => {
                                    const active = isProgramActive(program.applicationDeadline);
                                    return (
                                        <tr key={program.id} style={styles.tr}>
                                            <td style={styles.td}>{program.name}</td>
                                            <td style={styles.td}>{program.category}</td>
                                            <td style={styles.td}>{program.region}</td>
                                            <td style={styles.td}>
                                                <span style={active ? styles.statusActive : styles.statusInactive}>
                                                    {active ? 'Active' : 'Expired'}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <Link to={`/admin/edit-program/${program.id}`} style={styles.editLink}>
                                                    <Edit2 size={18} /> Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={styles.managementSection}>
                <h2 style={styles.sectionTitle}>Manage Healthcare Facilities</h2>
                {loadingLists ? <p>Loading facilities...</p> : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Address</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facilities.map(facility => (
                                    <tr key={facility.id} style={styles.tr}>
                                        <td style={styles.td}>{facility.name}</td>
                                        <td style={styles.td}>{facility.type}</td>
                                        <td style={styles.td}>{facility.address}</td>
                                        <td style={styles.td}>
                                            <span style={facility.isActive ? styles.statusActive : styles.statusInactive}>
                                                {facility.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <Link to={`/admin/edit-healthcare/${facility.id}`} style={styles.editLink}>
                                                <Edit2 size={18} /> Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        maxWidth: '1000px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '40px'
    },
    title: {
        fontSize: '32px',
        color: '#1f2937',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#6b7280',
        fontSize: '18px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '50px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    statIcon: {
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '50%'
    },
    statContent: {
        flex: 1
    },
    statValue: {
        fontSize: '28px',
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
        marginBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '10px'
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
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #e5e7eb'
    },
    actionIcon: {
        color: '#2563eb',
        marginBottom: '15px'
    },
    accessDenied: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff1f2',
        borderRadius: '8px'
    },
    managementSection: {
        marginTop: '50px'
    },
    tableWrapper: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
    },
    th: {
        backgroundColor: '#f9fafb',
        padding: '12px 15px',
        borderBottom: '1px solid #e5e7eb',
        color: '#374151',
        fontWeight: '600'
    },
    tr: {
        borderBottom: '1px solid #f3f4f6'
    },
    td: {
        padding: '12px 15px',
        color: '#4b5563'
    },
    statusActive: {
        backgroundColor: '#d1fae5',
        color: '#059669',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    statusInactive: {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    editLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '14px'
    }
};

export default AdminDashboard;
