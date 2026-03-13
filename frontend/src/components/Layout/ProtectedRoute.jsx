import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Role checking
    if (isAuthenticated) {
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Role not authorized, maybe redirect to a generic dashboard or unauthorized page
            return <Navigate to="/login" replace />;
        }
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
