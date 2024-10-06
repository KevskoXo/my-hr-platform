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

const MyJobs = ({ userRole }) => {
  const [jobs, setJobs] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filterRecruiter, setFilterRecruiter] = useState('');
  const [recruiters, setRecruiters] = useState([]);
  const navigate = useNavigate();
  const axiosInstance = createAxiosInstance('jobs');
  const axiosRecruiterInstance = createAxiosInstance('recruiters');
  const token = localStorage.getItem('accessToken');

  const jobTypes = ['IT', 'Engineering', 'Marketing', 'Finance', 'Sales', 'Human Resources', 'Other'];

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
  }, [userRole, axiosInstance, token]);

  const handleJobClick = (jobId) => {
    navigate(`/recruiter/jobs/${jobId}`); // Navigieren zur Job-Detailseite
  };

  const handleApplicantsClick = async (jobId) => {
    // Aktualisieren Sie den Job-Status, um das Symbol verschwinden zu lassen
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

      // Aktualisieren Sie die Jobliste, um den aktualisierten Status widerzuspiegeln
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, hasNewApplicants: false } : job
        )
      );

      navigate(`/jobs/${jobId}/applicants`); // Navigieren zur Bewerberliste
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Job-Status:', error);
    }
  };

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

  const handleCreateJob = () => {
    navigate('/jobs/create'); // Navigieren zur Job-Erstellungsseite
  };

  // Anwenden des Filters
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesType = filterType ? job.type === filterType : true;
    const matchesRecruiter =
      (userRole === 'superAdmin' || userRole === 'admin') && filterRecruiter
        ? job.recruiter && job.recruiter._id === filterRecruiter
        : true;
    const matchesDate = filterDate
      ? new Date(job.datePosted).toDateString() === filterDate.toDateString()
      : true;

    return matchesTitle && matchesType && matchesRecruiter && matchesDate;
  });

  return (
    <Box sx={{ marginTop: 2 }}>
      {/* Filterbereich */}
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Jobtitel suchen"
              variant="outlined"
              value={filterTitle}
              onChange={handleFilterTitleChange}
              fullWidth
            />
          </Grid>
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
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
              <ListItemText
                primary={job.title}
                secondary={
                  <>
                    {job.location} • {new Date(job.datePosted).toLocaleDateString()}
                    {(userRole === 'superAdmin' || userRole === 'admin') && job.recruiter && (
                      <Typography variant="body2">
                        Recruiter: {job.recruiter.name}
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleApplicantsClick(job._id)}>
                  {job.hasNewApplicants ? (
                    <Badge badgeContent={job.applicantCount} color="error">
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
