import React from 'react';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';
import CompanyDetails from '../components/CompanyDetails';
import { jwtDecode } from 'jwt-decode';

const CompanyPage = () => {
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    return (
        <div>
            <h1>Company Page</h1>
            <CompanyDetails companyId={decoded.company}/>
            {userRole === 'superAdmin' && (
                <>
                    <h2>Manage Jobs</h2>
                    <p>View and manage all jobs</p>
                    {/* Weitere Tools für das Management von Unternehmen und Admins */}
                </>
            )}
            {userRole === 'admin' && (
                <>
                    <h2>Manage Jobs</h2>
                    <p>View and manage your recruiters's jobs</p>
                    {/* Admin-spezifische Management-Tools */}
                </>
            )}
            {userRole === 'recruiter' && (
                <>
                    <h2>Manage Jobs</h2>
                    <p>View and manage your jobs</p>
                </>
            )}
            <RecruiterNavigationBar/>
        </div>
    );
};

export default CompanyPage;
