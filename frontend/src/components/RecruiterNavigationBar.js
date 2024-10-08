import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business'; // Icon für Company
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; // Neues Icon importieren
import '../App.css';
import LogoutButton from './LogoutButton';

const RecruiterNavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('role');
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
                value="/recruiter/dashboard"
                icon={<DashboardIcon />}
                style={location.pathname === '/dashboard' ? { color: '#1976d2' } : {}}
            />
            <BottomNavigationAction
                label="Company"
                value="/recruiter/company"
                icon={<BusinessIcon />} // Neues Icon für Company
                style={location.pathname === '/company' ? { color: '#1976d2' } : {}}
            />
            {(userRole === 'superAdmin' || userRole === 'admin' || userRole === 'recruiter') && (
              <BottomNavigationAction
                label="Search"
                value="/recruiter/userSearch"
                icon={<PersonSearchIcon />}
                style={location.pathname === '/recruiter/userSearch' ? { color: '#1976d2' } : {}}
              />
            )}
        </BottomNavigation>
    );
};

export default RecruiterNavigationBar;
