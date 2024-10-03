import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import BackButton from '../components/BackButton';
import { styled } from '@mui/material/styles';

// Dynamischer Slider-Container
const ToggleSliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  background: theme.palette.grey[300],
  borderRadius: 30,
  padding: '0',
  margin: '1rem 0',
  width: '100%',
  height: '45px',
  border: `3px solid ${theme.palette.primary.main}`,
}));

// Slider-Button
const ToggleSliderButton = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  lineHeight: '45px',
  cursor: 'pointer',
  zIndex: 2,
  fontWeight: 500,
  transition: 'color 0.3s',
  userSelect: 'none',
}));

// Schiebemarke mit dynamischer Positionierung
const SliderMarker = styled(Box)(({ theme, position, optionsCount }) => {
  const width = 100 / optionsCount + '%';
  const left = (100 / optionsCount) * position + '%';

  return {
    position: 'absolute',
    top: 0,
    left: left,
    width: width,
    height: '100%',
    background: theme.palette.primary.main,
    borderRadius: 30,
    transition: 'left 0.3s ease-in-out',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
  };
});

const RegisterNewRecruiterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recruiter');
  const userRole = localStorage.getItem('role');

  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance('recruiters');
  const token = localStorage.getItem('accessToken');

  // Verfügbare Rollen basierend auf der Benutzerrolle. initila mit recruiter damit der erste renderer nicht fehlschlägt
  const [availableRoles, setAvailableRoles] = useState(['viewer']);


  useEffect(() => {
    if (userRole === 'superAdmin') {
      setAvailableRoles(['admin', 'recruiter', 'viewer']);
      setRole('admin'); // Standardmäßig 'admin' für SuperAdmin
    } else if (userRole === 'admin'){
      setAvailableRoles(['recruiter', 'viewer']);
      setRole('recruiter'); // Standardmäßig 'recruiter' für Admin
    } else if (userRole === 'recruiter'){
      setAvailableRoles(['viewer']);
      setRole('viewer'); // Standardmäßig 'recruiter' für Admin
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';

      if (role === 'admin') {
        endpoint = '/create-admin';
      } else if (role === 'recruiter') {
        endpoint = '/create-recruiter';
      } else if (role === 'viewer') {
        endpoint = '/create-viewer'; // Stellen Sie sicher, dass dieser Endpunkt existiert
      }

      await axiosInstance.post(
        endpoint,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(-1);
    } catch (error) {
      console.error('Fehler beim Erstellen des neuen Benutzers:', error);
      // Optional: Fehlermeldung anzeigen
    }
  };

  // Funktion zur Bestimmung der Position des Schiebemarkers
  const getMarkerPosition = () => {
    return availableRoles.indexOf(role);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Neuen Benutzer registrieren
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="E-Mail"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Passwort"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {availableRoles.length > 1 ? (
          <ToggleSliderContainer>
            <SliderMarker position={getMarkerPosition()} optionsCount={availableRoles.length} />
            {availableRoles.map((availableRole) => (
              <ToggleSliderButton
                key={availableRole}
                onClick={() => setRole(availableRole)}
                style={{
                  color: role === availableRole ? '#fff' : '#000',
                }}
              >
                {availableRole.charAt(0).toUpperCase() + availableRole.slice(1)} erstellen
              </ToggleSliderButton>
            ))}
          </ToggleSliderContainer>
        ) : (
          <Box sx={{ margin: '1rem 0' }}>
            <Typography variant="h6">
              {availableRoles[0].charAt(0).toUpperCase() + availableRoles[0].slice(1)} erstellen
            </Typography>
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '1rem' }}>
          Registrieren
        </Button>
      </form>
      <BackButton />
    </Box>
  );
};

export default RegisterNewRecruiterPage;
