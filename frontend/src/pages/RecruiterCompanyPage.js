import React from 'react';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';

const CompanyPage = () => {
    const userRole = localStorage.getItem('role');

    return (
        <div>
            <h1>Company Page</h1>
            {userRole === 'superAdmin' && (
                <>
                    <h2>Manage Companies</h2>
                    <p>View and manage all companies</p>
                    {/* Weitere Tools für das Management von Unternehmen und Admins */}
                </>
            )}
            {userRole === 'admin' && (
                <>
                    <h2>Manage Your Company</h2>
                    <p>View and manage your company's recruiters and settings</p>
                    {/* Admin-spezifische Management-Tools */}
                </>
            )}
            {userRole === 'recruiter' && (
                <>
                    <h2>Company Overview</h2>
                    <p>View basic company information</p>
                </>
            )}
            <RecruiterNavigationBar/>
        </div>
    );
};

export default CompanyPage;
