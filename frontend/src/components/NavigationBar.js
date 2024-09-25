import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import '../App.css';
import LogoutButton from './LogoutButton';
import Button from '@mui/material';

const NavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigationChange = (event, newValue) => {
        navigate(newValue);
    };

    return (
        <BottomNavigation
            value={location.pathname}  // Aktuelle Route für Markierung
            onChange={handleNavigationChange}
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                backgroundColor: '#f8f9fa', // Hintergrundfarbe der Navigation
            }}
        >
            <BottomNavigationAction
                label="Dashboard"
                value="/dashboard"
                icon={<DashboardIcon />}
                style={location.pathname === '/dashboard' ? { color: '#1976d2' } : {}}
            />
            <BottomNavigationAction
                label="Profile"
                value="/profile"
                icon={<AccountCircleIcon />}
                style={location.pathname === '/profile' ? { color: '#1976d2' } : {}}
            />
            <BottomNavigationAction
                label="Jobs"
                value="/jobs"
                icon={<WorkIcon />}
                style={location.pathname === '/jobs' ? { color: '#1976d2' } : {}}
            />
            {/* Logout-Button */}
            <LogoutButton></LogoutButton>
        </BottomNavigation>
    );
};

export default NavigationBar;
