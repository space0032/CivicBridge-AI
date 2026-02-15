import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <Loader className="animate-spin" size={48} color="#2563eb" />
                <p>Authenticating...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has any of the allowed roles
    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => hasRole(role));
        if (!hasPermission) {
            return <Navigate to="/" replace />;
        }
    }

    return children ? children : <Outlet />;
};

const styles = {
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)',
        gap: '20px',
        color: '#6b7280'
    }
};

export default ProtectedRoute;
