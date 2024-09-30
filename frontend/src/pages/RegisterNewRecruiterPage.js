import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance'; // Deine eigene axios-Instanz
import BackButton from '../components/BackButton';
import { styled } from '@mui/material/styles';

// Slider-Container mit Styling, das beide Optionen umrahmt
const ToggleSliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  background: theme.palette.grey[300],
  borderRadius: 30,
  padding: '0',
  margin: '1rem 0',
  width: '100%',
  height: '45px', // Höhe des Slider-Markers
  border: `3px solid ${theme.palette.primary.main}`, // Blauer Rahmen um beide Optionen
}));

// Slider-Button mit hervorgehobenem Stil
const ToggleSliderButton = styled(Box)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  lineHeight: '45px', // Zentriert den Text vertikal
  cursor: 'pointer',
  zIndex: 2, // Oberhalb des Schiebers platzieren
  fontWeight: 500,
  transition: 'color 0.3s',
}));

// Schiebemarke für den Slider-Effekt (Kleiner Track)
const SliderMarker = styled(Box)(({ theme, position }) => ({
  position: 'absolute',
  top: 0,
  left: position === 'recruiter' ? 0 : 'calc(50%)',
  width: '50%',
  height: '100%',
  background: theme.palette.primary.main,
  borderRadius: 30,
  transition: 'left 0.3s ease-in-out',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Leichter Schatten für bessere Sichtbarkeit
  cursor: 'pointer',
}));

const RegisterNewRecruiterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('recruiter'); // Standardmäßig 'recruiter'
  const userRole = localStorage.getItem('role');

  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance('recruiters'); // Erstelle eine Instanz von axios
  const token = localStorage.getItem('accessToken');

  // Bestimmen der verfügbaren Rollen
  useEffect(() => {
    if (userRole === 'superAdmin') {
      setRole('admin'); // SuperAdmin kann Admins erstellen, standardmäßig auf Admin gesetzt
    } else {
      setRole('recruiter'); // Admins können nur Recruiter erstellen
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
      }

      await axiosInstance.post(endpoint, {
        name,
        email,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Nach erfolgreicher Registrierung zur Profilseite navigieren
      navigate('/profile');
    } catch (error) {
      console.error('Fehler beim Erstellen des neuen Benutzers:', error);
      // Optional: Fehlermeldung anzeigen
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Neuen Recruiter/Administrator registrieren
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
        {(userRole === 'superAdmin' || userRole === 'admin') && (
          <ToggleSliderContainer>
            <SliderMarker position={role} />
            <ToggleSliderButton
              onClick={() => setRole('recruiter')}
              style={{
                color: role === 'recruiter' ? '#fff' : '#000',
              }}
            >
              Recruiter erstellen
            </ToggleSliderButton>
            <ToggleSliderButton
              onClick={() => setRole('admin')}
              disabled={userRole !== 'superAdmin'}
              style={{
                color: role === 'admin' ? '#fff' : '#000',
              }}
            >
              Admin erstellen
            </ToggleSliderButton>
          </ToggleSliderContainer>
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
