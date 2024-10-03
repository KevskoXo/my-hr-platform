// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelection from './components/RoleSelection';
import LoginPage from './pages/LoginPage';
import RecruiterProfilePage from './pages/RecruiterProfilePage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import JobSeekerProfilePage from './pages/JobSeekerProfilePage';
import RecruiterRegisterPage from './pages/RecruiterRegisterPage';
import RecruiterCompanyPage from './pages/RecruiterCompanyPage';
import JobSeekerDashboardPage from './pages/JobSeekerDashboardPage';
import JobSeekerRegisterPage from './pages/JobSeekerRegisterPage';
import JobSeekerJobsPage from './pages/JobSeekerJobsPage';
import RegisterNewRecruiterPage from './pages/RegisterNewRecruiterPage';
import RecruiterUserSearchPage from './pages/RecruiterUserSearchPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" />} />
                
                <Route path="/register" element={<RoleSelection />} />
                <Route path="/register/jobseeker" element={<JobSeekerRegisterPage />} />
                <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />         

                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><JobSeekerDashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={["user"]}><JobSeekerProfilePage /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobSeekerJobsPage /></ProtectedRoute>} />

                <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['viewer', 'recruiter', 'admin', 'superAdmin']}><RecruiterDashboardPage /></ProtectedRoute>} />
                <Route path="/recruiter/profile" element={<ProtectedRoute allowedRoles={['recruiter', 'admin', 'superAdmin']}><RecruiterProfilePage /></ProtectedRoute>} />
                <Route path="/recruiter/newRecruiter" element={<ProtectedRoute allowedRoles={['admin', 'superAdmin','recruiter']}><RegisterNewRecruiterPage/></ProtectedRoute>} />
                <Route path="/recruiter/company" element={<ProtectedRoute allowedRoles={['viewer', 'recruiter', 'admin', 'superAdmin']}><RecruiterCompanyPage /></ProtectedRoute>} />
                <Route path="/recruiter/userSearch" element={<ProtectedRoute allowedRoles={['recruiter', 'admin', 'superAdmin']}><RecruiterUserSearchPage /></ProtectedRoute>} />

            </Routes>
        </Router>
    );
}

export default App;
