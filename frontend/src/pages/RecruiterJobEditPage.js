// src/components/RecruiterJobEditPage.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import Autocomplete from '@mui/material/Autocomplete'; // Für Autovervollständigung

const employmentTypes = ['Vollzeit', 'Teilzeit', 'Freelance', 'Praktikum', 'Werkstudent', 'Andere'];

// Beispiel für häufig verwendete Skills und Tasks für Autovervollständigung
const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Projektmanagement', 'Marketing', 'Vertrieb', 'Finanzen', 'HR', 'Design', 'Andere'];
const commonTasks = ['Entwicklung', 'Design', 'Testing', 'Marketingkampagnen', 'Projektplanung', 'Kundensupport', 'Vertriebsgespräche', 'Finanzanalyse', 'HR-Management', 'Andere'];

const RecruiterJobEditPage = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');

  // Memoize the axiosInstance to prevent it from changing on every render
  const axiosInstance = useMemo(() => createAxiosInstance('jobs'), []);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobData = response.data;

        // Überprüfen und Konvertieren von jobData.skills in ein Array
        if (jobData.skills) {
          if (typeof jobData.skills === 'string') {
            jobData.skills = jobData.skills.split(';').map(skill => skill.trim());
          } else if (Array.isArray(jobData.skills)) {
            // Nichts tun, es ist bereits ein Array
          } else {
            // Falls skills ein anderes Format hat, initialisieren wir es als leeres Array
            jobData.skills = [];
          }
        } else {
          jobData.skills = [];
        }

        // Überprüfen und Konvertieren von jobData.tasks in ein Array
        if (jobData.tasks) {
          if (typeof jobData.tasks === 'string') {
            jobData.tasks = jobData.tasks.split(';').map(task => task.trim());
          } else if (Array.isArray(jobData.tasks)) {
            // Nichts tun, es ist bereits ein Array
          } else {
            // Falls tasks ein anderes Format hat, initialisieren wir es als leeres Array
            jobData.tasks = [];
          }
        } else {
          jobData.tasks = [];
        }

        setJobData(jobData);
        setFormData(jobData);
      } catch (error) {
        console.error('Fehler beim Abrufen des Jobs:', error);
        setSnackbarMessage('Fehler beim Abrufen des Jobs.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchJob();
  }, [jobId, axiosInstance, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Spezifische Behandlung für numerische Felder
    if (name === 'salary') {
      // Verhindern, dass der Benutzer negative Werte eingibt
      if (value < 0) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (event, value) => {
    setFormData({ ...formData, skills: value });
  };

  const handleTasksChange = (event, value) => {
    setFormData({ ...formData, tasks: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage('Job erfolgreich aktualisiert!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate(`/recruiter/jobs/${jobId}`);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Jobs:', error);
      setSnackbarMessage('Fehler beim Aktualisieren des Jobs.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (!jobData) {
    return <Typography>Lädt...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Job bearbeiten
      </Typography>
      <Paper sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Titel */}
            <Grid item xs={12}>
              <TextField
                label="Jobtitel"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            {/* Beschreibung */}
            <Grid item xs={12}>
              <TextField
                label="Stellenbeschreibung"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={6}
                required
              />
            </Grid>
            {/* Standort */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Standort"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* Anstellungstyp */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Anstellungstyp"
                name="employmentType"
                value={formData.employmentType || ''}
                onChange={handleInputChange}
                fullWidth
              >
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Startdatum */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Startdatum"
                name="startDate"
                type="date"
                value={formData.startDate ? formData.startDate.substring(0, 10) : ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {/* Gehalt */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Gehalt (EUR)"
                name="salary"
                type="number"
                value={formData.salary || ''}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            {/* Task-Input */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={commonTasks}
                value={formData.tasks || []}
                onChange={handleTasksChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Gewünschte Aufgaben (Mehrfachauswahl)"
                    placeholder="Aufgaben hinzufügen"
                  />
                )}
              />
            </Grid>
            {/* Skills-Input */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={commonSkills}
                value={formData.skills || []}
                onChange={handleSkillsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Gewünschte Fähigkeiten (Mehrfachauswahl)"
                    placeholder="Fähigkeiten hinzufügen"
                  />
                )}
              />
            </Grid>
            {/* Video URL */}
            <Grid item xs={12}>
              <TextField
                label="Video URL"
                name="videoUrl"
                value={formData.videoUrl || ''}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* Buttons */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Speichern
              </Button>
              <Button
                variant="outlined"
                sx={{ marginLeft: 2 }}
                onClick={() => navigate(-1)}
              >
                Abbrechen
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar für Benutzerfeedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecruiterJobEditPage;
