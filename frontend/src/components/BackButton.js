// src/components/BackButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ label = 'Zurück', to, customStyles }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Navigiert zur vorherigen Seite in der Browserhistorie
    }
  };

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{
        margin: '1rem',
        ...customStyles, // Ermöglicht das Übergeben benutzerdefinierter Styles
      }}
    >
      {label}
    </Button>
  );
};

export default BackButton;
