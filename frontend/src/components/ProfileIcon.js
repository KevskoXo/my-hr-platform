import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';

const ProfileIcon = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Event-Handler zum Öffnen des Menüs
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Event-Handler zum Schließen des Menüs
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handler für Menüeinträge
  const handleProfileClick = () => {
    navigate('/recruiter/profile');
    handleMenuClose();
  };

  const handleMessagesClick = () => {
    navigate('/messages'); // Passen Sie den Pfad entsprechend an
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    // Ihre Logout-Logik hier
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/login'); // Zur Login-Seite navigieren
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
      }}
    >
      <IconButton
        onClick={handleMenuOpen}
        size="large"
        aria-controls="profile-menu"
        aria-haspopup="true"
      >
        <AccountCircleIcon fontSize="large" />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Profil</Typography>
        </MenuItem>
        <MenuItem onClick={handleMessagesClick}>
          <ListItemIcon>
            <MessageIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Nachrichten</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileIcon;
