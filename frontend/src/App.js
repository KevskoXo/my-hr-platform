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
import Jobs from './components/Jobs';
import RoleSelection from './components/RoleSelection';
import JobSeekerRegister from './components/JobSeekerRegister';
import RecruiterRegister from './components/RecruiterRegister';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RoleSelection />} />
                <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
                <Route path="/register/recruiter" element={<RecruiterRegister />} />               
                <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
                <Route path="/recruiter/dashboard" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
                <Route path="/recruiter/profile" element={<ProtectedRoute role="recruiter"><RecruiterProfile /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
