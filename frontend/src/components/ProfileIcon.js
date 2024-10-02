import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileIcon = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/recruiter/profile'); // Verlinkung zur Profilseite
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
      }}
    >
      <IconButton onClick={handleProfileClick}>
        <AccountCircleIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default ProfileIcon;
