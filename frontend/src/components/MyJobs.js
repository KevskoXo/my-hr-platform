// src/components/MyJobs.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { de } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Autocomplete from '@mui/material/Autocomplete'; // Für Autovervollständigung

const MyJobs = ({ userRole }) => {
  const [jobs, setJobs] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filterRecruiter, setFilterRecruiter] = useState('');
  const [filterTask, setFilterTask] = useState(''); // Neuer Task-Filter
  const [filterSalary, setFilterSalary] = useState(''); // Neuer Salary-Filter
  const [recruiters, setRecruiters] = useState([]);
  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance('jobs');
  const axiosRecruiterInstance = createAxiosInstance('recruiters');
  const token = localStorage.getItem('accessToken');

  // Definiere die möglichen Employment Types entsprechend deinem Schema
  const employmentTypes = ['Vollzeit', 'Teilzeit', 'Freelance', 'Praktikum', 'Werkstudent', 'Andere'];

  // Beispiel für häufig verwendete Tasks für Autovervollständigung
  const commonTasks = ['Entwicklung', 'Design', 'Testing', 'Marketingkampagnen', 'Projektplanung', 'Kundensupport', 'Vertriebsgespräche', 'Finanzanalyse', 'HR-Management', 'Andere'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let endpoint = '';

        if (userRole === 'superAdmin') {
          endpoint = '/byCompany';
        } else if (userRole === 'admin') {
          endpoint = '/byAdmin';
        } else if (userRole === 'recruiter') {
          endpoint = '/byRecruiter';
        } else if (userRole === 'viewer') {
          endpoint = '/byViewer';
        }

        const response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Jobs:', error);
      }
    };

    fetchJobs();
  }, [userRole, axiosInstance, token]);

  // Recruiter-Liste abrufen (für SuperAdmin und Admin)
  useEffect(() => {
    const fetchRecruiters = async () => {
      if (userRole === 'superAdmin' || userRole === 'admin') {
        try {
          const response = await axiosRecruiterInstance.get('/recruiters', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRecruiters(response.data);
        } catch (error) {
          console.error('Fehler beim Abrufen der Recruiter:', error);
        }
      }
    };

    fetchRecruiters();
  }, [userRole, axiosRecruiterInstance, token]);

  // Navigiert zur Job-Detailseite
  const handleJobClick = (jobId) => {
    navigate(`/recruiter/jobs/${jobId}`);
  };

  // Handle-Klick auf Bewerber-Icon
  const handleApplicantsClick = async (jobId) => {
    try {
      await axiosInstance.post(
        `/${jobId}/markAsViewed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Aktualisiere die Jobliste, um den neuen Bewerber-Status widerzuspiegeln
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, newApplicantCount: 0 } : job
        )
      );

      navigate(`/jobs/${jobId}/applicants`); // Navigiere zur Bewerberliste mit vorgefilterten neuen Bewerbern
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Job-Status:', error);
      // Optional: Zeige eine Fehlermeldung an (z.B. mit Snackbar)
    }
  };

  // Filter-Handler
  const handleFilterTitleChange = (e) => {
    setFilterTitle(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterDateChange = (date) => {
    setFilterDate(date);
  };

  const handleFilterRecruiterChange = (e) => {
    setFilterRecruiter(e.target.value);
  };

  const handleFilterTaskChange = (event, value) => {
    setFilterTask(value);
  };

  const handleFilterSalaryChange = (e) => {
    setFilterSalary(e.target.value);
  };

  // Navigiert zur Job-Erstellungsseite
  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  // Anwenden des Filters auf die Jobliste
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesType = filterType ? job.employmentType === filterType : true;
    const matchesRecruiter =
      (userRole === 'superAdmin' || userRole === 'admin') && filterRecruiter
        ? job.recruiter && job.recruiter._id === filterRecruiter
        : true;
    const matchesDate = filterDate
      ? new Date(job.datePosted).toDateString() === filterDate.toDateString()
      : true;
    const matchesTask = filterTask ? job.tasks.includes(filterTask) : true;
    const matchesSalary = filterSalary ? job.salary >= parseInt(filterSalary, 10) : true;

    return matchesTitle && matchesType && matchesRecruiter && matchesDate && matchesTask && matchesSalary;
  });

  return (
    <Box sx={{ marginTop: 2 }}>
      {/* Titel */}
      <Typography variant="h4" gutterBottom>
        Meine Jobs
      </Typography>

      {/* Filterbereich */}
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          {/* Jobtitel-Suche */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Jobtitel suchen"
              variant="outlined"
              value={filterTitle}
              onChange={handleFilterTitleChange}
              fullWidth
            />
          </Grid>

          {/* Anstellungstyp-Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="type-label">Typ</InputLabel>
              <Select
                labelId="type-label"
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Typ"
              >
                <MenuItem value="">
                  <em>Alle</em>
                </MenuItem>
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Recruiter-Filter (nur für Admins und SuperAdmins) */}
          {(userRole === 'superAdmin' || userRole === 'admin') && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="recruiter-label">Recruiter</InputLabel>
                <Select
                  labelId="recruiter-label"
                  value={filterRecruiter}
                  onChange={handleFilterRecruiterChange}
                  label="Recruiter"
                >
                  <MenuItem value="">
                    <em>Alle</em>
                  </MenuItem>
                  {recruiters.map((recruiter) => (
                    <MenuItem key={recruiter._id} value={recruiter._id}>
                      {recruiter.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Datum-Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
              <DatePicker
                label="Datum"
                value={filterDate}
                onChange={handleFilterDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Task-Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              options={commonTasks}
              freeSolo
              value={filterTask}
              onChange={handleFilterTaskChange}
              renderInput={(params) => <TextField {...params} label="Aufgabe filtern" variant="outlined" />}
              fullWidth
            />
          </Grid>

          {/* Salary-Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Gehalt ab (EUR)"
              variant="outlined"
              type="number"
              value={filterSalary}
              onChange={handleFilterSalaryChange}
              fullWidth
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Anzeige der Jobs */}
      <List>
        {filteredJobs.map((job) => (
          <Paper key={job._id} sx={{ marginBottom: 2 }}>
            <ListItem
              onClick={() => handleJobClick(job._id)}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemAvatar>
                <Avatar>
                  {/* Optional: Firmenlogo oder Recruiter-Avatar */}
                  {job.recruiter && job.recruiter.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={job.title}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      {job.location && `Ort: ${job.location.type === 'Point' ? `Longitude: ${job.location.coordinates[0]}, Latitude: ${job.location.coordinates[1]}` : job.location}`} • {new Date(job.datePosted).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Gehalt: {job.salary ? job.salary.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : 'Verhandelbar'}
                    </Typography>
                    {(userRole === 'superAdmin' || userRole === 'admin') && job.recruiter && (
                      <Typography variant="body2" color="textSecondary">
                        Recruiter: {job.recruiter.name}
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleApplicantsClick(job._id)}>
                  {job.newApplicantCount > 0 ? (
                    <Badge badgeContent={job.newApplicantCount} color="error">
                      <NotificationsActiveIcon color="error" />
                    </Badge>
                  ) : (
                    <InfoIcon color="action" />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}

        {/* "Neuen Job erstellen" Container */}
        {userRole !== 'viewer' && (
          <Paper sx={{ marginBottom: 2 }}>
            <ListItem onClick={handleCreateJob} sx={{ cursor: 'pointer' }}>
              <ListItemAvatar>
                <Avatar>
                  <AddCircleOutlineIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Neuen Job erstellen"
                primaryTypographyProps={{ variant: 'h6' }}
              />
            </ListItem>
          </Paper>
        )}
      </List>
    </Box>
  );
};

export default MyJobs;
