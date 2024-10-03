import React from 'react';
import { Avatar, IconButton, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AvatarPlusIcon = ({ userRole, onAdd }) => {
  const navigate = useNavigate();

  if (userRole !== 'recruiter' && userRole !== 'admin' && userRole !== 'superAdmin') {
    return null; // Wenn der Benutzer kein Admin oder SuperAdmin ist, wird nichts gerendert
  }

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    } else {
      navigate('/recruiter/newRecruiter'); // Standardmäßige Navigation zur Registrierungsseite
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', margin: '1rem' }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
        <IconButton onClick={handleAddClick} sx={{ color: 'white' }}>
          <Add />
        </IconButton>
      </Avatar>
    </Box>
  );
};

export default AvatarPlusIcon;
