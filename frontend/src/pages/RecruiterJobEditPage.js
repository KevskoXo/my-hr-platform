// src/components/RecruiterJobEditPage.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import Autocomplete from '@mui/material/Autocomplete';

const employmentTypes = ['Vollzeit', 'Teilzeit', 'Freelance', 'Praktikum', 'Werkstudent', 'Andere'];
const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Projektmanagement', 'Marketing', 'Vertrieb', 'Finanzen', 'HR', 'Design', 'Andere'];
const commonTasks = ['Entwicklung', 'Design', 'Testing', 'Marketingkampagnen', 'Projektplanung', 'Kundensupport', 'Vertriebsgespräche', 'Finanzanalyse', 'HR-Management', 'Andere'];

const RecruiterJobEditPage = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [formData, setFormData] = useState({});
  const [recruiters, setRecruiters] = useState([]);
  const [viewers, setViewers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role');

  const axiosInstance = useMemo(() => createAxiosInstance('jobs'), []);
  const axiosRecruiterInstance = useMemo(() => createAxiosInstance('recruiters'), []);
  const axiosViewerInstance = useMemo(() => createAxiosInstance('recruiters'), []); // Da Viewer auch Recruiter sind

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [isJobLoaded, setIsJobLoaded] = useState(false);
  const [isRecruitersLoaded, setIsRecruitersLoaded] = useState(false);
  const [isViewersLoaded, setIsViewersLoaded] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobData = response.data;

        console.log('Fetched Job Data:', jobData); // Debugging

        // Überprüfen und Konvertieren von jobData.skills in ein Array
        if (jobData.skills) {
          if (typeof jobData.skills === 'string') {
            jobData.skills = jobData.skills.split(';').map(skill => skill.trim());
          } else if (Array.isArray(jobData.skills)) {
            // Nichts tun, es ist bereits ein Array
          } else {
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
            jobData.tasks = [];
          }
        } else {
          jobData.tasks = [];
        }

        setJobData(jobData);
        setIsJobLoaded(true);
      } catch (error) {
        console.error('Fehler beim Abrufen des Jobs:', error);
        setSnackbarMessage('Fehler beim Abrufen des Jobs.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    const fetchRecruiters = async () => {
      if (userRole === 'superAdmin' || userRole === 'admin') {
        try {
          const response = await axiosRecruiterInstance.get('/recruiters', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecruiters(response.data);
          console.log('Fetched Recruiters:', response.data); // Debugging
          setIsRecruitersLoaded(true);
        } catch (error) {
          console.error('Fehler beim Abrufen der Recruiter:', error);
        }
      } else {
        setIsRecruitersLoaded(true); // Keine Recruiter abzurufen, trotzdem setzen
      }
    };

    const fetchViewers = async () => {
      try {
        const response = await axiosViewerInstance.get('/viewers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setViewers(response.data);
        console.log('Fetched Viewers:', response.data); // Debugging
        setIsViewersLoaded(true);
      } catch (error) {
        console.error('Fehler beim Abrufen der Viewer:', error);
      }
    };

    fetchJob();
    fetchRecruiters();
    fetchViewers();
  }, [jobId, axiosInstance, axiosRecruiterInstance, axiosViewerInstance, token, userRole]);

  // Setzen des formData nur, wenn alle Daten geladen sind
  useEffect(() => {
    if (isJobLoaded && isViewersLoaded && (userRole !== 'superAdmin' && userRole !== 'admin' || isRecruitersLoaded)) {
      if (jobData) {
        setFormData({
          ...jobData,
          recruiter: jobData.recruiter ? jobData.recruiter._id.toString() : null,
          assignedViewers: jobData.assignedViewers ? jobData.assignedViewers.map(viewer => viewer._id.toString()) : [],
        });

        console.log('Form Data after setting:', {
          ...jobData,
          recruiter: jobData.recruiter ? jobData.recruiter._id.toString() : null,
          assignedViewers: jobData.assignedViewers ? jobData.assignedViewers.map(viewer => viewer._id.toString()) : [],
        }); // Debugging
      }
    }
  }, [isJobLoaded, isRecruitersLoaded, isViewersLoaded, jobData, userRole]);

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

  const handleRecruiterChange = (event, value) => {
    setFormData({ ...formData, recruiter: value ? value._id.toString() : null });
    console.log('Selected Recruiter:', value); // Debugging
  };

  const handleViewersChange = (event, value) => {
    setFormData({ ...formData, assignedViewers: value.map(viewer => viewer._id.toString()) });
    console.log('Selected Viewers:', value); // Debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Update Response:', response.data); // Debugging
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

  if (!isJobLoaded || !isViewersLoaded || ((userRole === 'superAdmin' || userRole === 'admin') && !isRecruitersLoaded)) {
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
              <FormControl fullWidth>
                <InputLabel id="employment-type-label">Anstellungstyp</InputLabel>
                <Select
                  labelId="employment-type-label"
                  label="Anstellungstyp"
                  name="employmentType"
                  value={formData.employmentType || ''}
                  onChange={handleInputChange}
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            {/* Recruiter-Input: Nur für superAdmin und admin sichtbar */}
            {(userRole === 'superAdmin' || userRole === 'admin') && (
              <Grid item xs={12}>
                <Autocomplete
                  options={recruiters}
                  getOptionLabel={(option) => option.name}
                  value={recruiters.find(r => r._id.toString() === formData.recruiter) || null}
                  onChange={handleRecruiterChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Recruiter auswählen"
                      placeholder="Recruiter hinzufügen"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option._id.toString() === value._id.toString()}
                />
              </Grid>
            )}
            {/* Viewer-Input: Für alle Benutzer sichtbar */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={viewers}
                getOptionLabel={(option) => option.name}
                value={viewers.filter(viewer => formData.assignedViewers?.includes(viewer._id.toString())) || []}
                onChange={handleViewersChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Viewer auswählen"
                    placeholder="Viewer hinzufügen"
                  />
                )}
                isOptionEqualToValue={(option, value) => option._id.toString() === value._id.toString()}
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
