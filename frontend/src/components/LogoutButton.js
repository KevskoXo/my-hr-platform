import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Token aus dem localStorage entfernen
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role'); // Falls du die Rolle auch speicherst

        // Umleitung zur Login-Seite
        navigate('/login');
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
