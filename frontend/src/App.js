// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
// eslint-disable-next-line import/no-unresolved
import RecruiterDashboard from './components/RecruiterDashboard';
import Profile from './components/Profile';
import RecruiterProfile from './components/RecruiterProfile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
                <Route path="/recruiter/dashboard" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
                <Route path="/recruiter/profile" element={<ProtectedRoute role="recruiter"><RecruiterProfile /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
