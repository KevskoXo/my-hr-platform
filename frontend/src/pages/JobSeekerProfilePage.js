import React from 'react';
import { Avatar, Typography, Button } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import { jwtDecode } from 'jwt-decode';

const JobSeekerProfilePage = () => {
    let token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    const user = {
        name: decoded.name,
        email: decoded.email,
        // Falls kein Benutzerbild vorhanden ist, wird die Silhouette verwendet
        avatar: null // oder ein Bild-URL
    };

    return (
        <div>
            <h1>Profile</h1>
            {
                    <div className="container mt-5">
                    <Typography variant="h4" component="h2" align="center">User Profile</Typography>
                    <div className="mt-4 d-flex flex-column align-items-center">
                        <Avatar
                            alt={user.name}
                            src={user.avatar}
                            style={{ width: 100, height: 100 }}
                        />
                        <Typography variant="h6" style={{ marginTop: '20px' }}>{user.name}</Typography>
                        <Typography variant="body1">{user.email}</Typography>
                    </div>
                </div>
            }
            <NavigationBar />
        </div>
    );
};


export default JobSeekerProfilePage;
