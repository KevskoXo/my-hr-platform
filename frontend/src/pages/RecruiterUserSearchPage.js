import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Avatar, Card, CardContent } from '@mui/material';
import createAxiosInstance from '../services/axiosInstance';
import FilterListIcon from '@mui/icons-material/FilterList';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';
import ProfileIcon from '../components/ProfileIcon';

const RecruiterUserSearchPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: '',
  });
  const userRole = localStorage.getItem('role');

  const axiosInstance = createAxiosInstance('users'); // Instanz zum Abrufen der Benutzerdaten
  
  // Benutzer abrufen
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/');
        setUsers(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    };
    
    fetchUsers();
  }, [axiosInstance]);
  
  // Filterlogik
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Hier wird die Suchlogik implementiert
    // z.B. Benutzer nach Standort, Erfahrung und Fähigkeiten filtern
  };


  return (
    <div>
    {/* Profil-Icon rechts oben */}
      <ProfileIcon userRole={userRole}/>

    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Benutzer suchen
      </Typography>

      {/* Such- und Filterbereich */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Nach Benutzer suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" startIcon={<FilterListIcon />} onClick={handleSearch}>
          Suchen
        </Button>
      </Box>

      {/* Filtereinstellungen */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          variant="outlined"
          label="Standort"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <TextField
          variant="outlined"
          label="Erfahrung (in Jahren)"
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
        />
        <TextField
          variant="outlined"
          label="Fähigkeiten"
          name="skills"
          value={filters.skills}
          onChange={handleFilterChange}
        />
      </Box>

      {/* Benutzerliste */}
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={user.avatar} alt={user.name} sx={{ width: 60, height: 60, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">{user.location}</Typography>
                  <Typography variant="body2">{user.skills?.join(', ')}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    
    <RecruiterNavigationBar/>
    </div>
  );
};

export default RecruiterUserSearchPage;
