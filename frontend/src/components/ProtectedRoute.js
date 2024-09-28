import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const accessToken = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role'); // Rolle aus dem Token oder separaten Speicherort abrufen

    if (!accessToken || (allowedRoles && !allowedRoles.includes(userRole))) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
