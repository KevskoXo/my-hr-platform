import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ label = 'Zurück', customStyles }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigiert zur vorherigen Seite in der Browserhistorie
  };

  return (
    <Button
      //variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{
        margin: '1rem',
        ...customStyles, // Erlaube es, benutzerdefinierte Styles zu übergeben
      }}
    >
      {label}
    </Button>
  );
};

export default BackButton;
