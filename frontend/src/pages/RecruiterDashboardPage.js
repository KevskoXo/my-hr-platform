import React from 'react';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';
import ProfileIcon from '../components/ProfileIcon';

const DashboardPage = () => {
    const userRole = localStorage.getItem('role'); // Rolle des Benutzers abrufen

    return (
        <div>
            {/* Profil-Icon rechts oben */}
            <ProfileIcon userRole={userRole}/>
            <h1>Dashboard</h1>
            {userRole === 'superAdmin' && (
                <>
                    <h2>SuperAdmin Tools</h2>
                    <p>Manage all companies and admins</p>
                    {/* Weitere SuperAdmin-spezifische Tools */}
                </>
            )}
            {userRole === 'admin' && (
                <>
                    <h2>Admin Tools</h2>
                    <p>Manage your recruiters and company information</p>
                    {/* Admin-spezifische Tools */}
                </>
            )}
            {userRole === 'recruiter' && (
                <>
                    <h2>Recruiter Tools</h2>
                    <p>Manage your job postings and applications</p>
                    {/* Recruiter-spezifische Tools */}
                </>
            )}
            <RecruiterNavigationBar/>
        </div>
    );
};

export default DashboardPage;
