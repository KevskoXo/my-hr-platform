// src/components/RecruiterJobPage.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SettingsIcon from '@mui/icons-material/Settings';
import BackButton from '../components/BackButton';

const RecruiterJobPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const axiosInstance = createAxiosInstance('jobs');
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

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
            jobData.skills = jobData.skills.split(';');
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
            jobData.tasks = jobData.tasks.split(';');
          } else if (Array.isArray(jobData.tasks)) {
            // Nichts tun, es ist bereits ein Array
          } else {
            // Falls tasks ein anderes Format hat, initialisieren wir es als leeres Array
            jobData.tasks = [];
          }
        } else {
          jobData.tasks = [];
        }

        setJob(jobData);
      } catch (error) {
        console.error('Fehler beim Abrufen des Jobs:', error);
      }
    };

    fetchJob();
  }, [jobId, axiosInstance, token]);

  if (!job) {
    return <Typography>Lädt...</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* BackButton */}
      <BackButton to='/recruiter/company/'/>

      {/* Oberer Bereich mit CompanyAvatar, Jobtitel und ggf. Zahnrad-Icon */}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={job.company.logoUrl}
              alt={job.company.name}
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="h6">
              {job.company.name}
            </Typography>
            <Typography variant="subtitle1">
              {job.location && job.location.type === 'Point'
                ? `Longitude: ${job.location.coordinates[0]}, Latitude: ${job.location.coordinates[1]}`
                : job.location
              } • {new Date(job.datePosted).toLocaleDateString('de-DE')}
            </Typography>
          </Grid>
          {/* Zahnrad-Icon für berechtigte Benutzer */}
          {(userRole === 'recruiter' || userRole === 'admin' || userRole === 'superAdmin') && (
            <Grid item>
              <IconButton
                onClick={() => navigate(`/recruiter/jobs/${jobId}/edit`)}
                aria-label="Job bearbeiten"
              >
                <SettingsIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Kurzinfos */}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="textSecondary">
              <strong>Anstellungstyp:</strong>
            </Typography>
            <Typography variant="body1">
              {job.employmentType || 'Nicht angegeben'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="textSecondary">
              <strong>Startdatum:</strong>
            </Typography>
            <Typography variant="body1">
              {job.startDate ? new Date(job.startDate).toLocaleDateString('de-DE') : 'Nicht angegeben'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="textSecondary">
              <strong>Gehalt:</strong>
            </Typography>
            <Typography variant="body1">
              {job.salary
                ? job.salary.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
                : 'Verhandelbar'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Beschreibung */}
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Stellenbeschreibung
        </Typography>
        <Typography variant="body1">
          {job.description}
        </Typography>
      </Paper>

      {/* Gewünschte Aufgaben */}
      {job.tasks && job.tasks.length > 0 && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gewünschte Aufgaben
          </Typography>
          <Grid container spacing={1}>
            {job.tasks.map((task, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, marginRight: 1 }} />
                  {task}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Gewünschte Fähigkeiten */}
      {job.skills && job.skills.length > 0 && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gewünschte Fähigkeiten
          </Typography>
          <Grid container spacing={1}>
            {job.skills.map((skill, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiberManualRecordIcon sx={{ fontSize: 8, marginRight: 1 }} />
                  {skill}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Optionales Video */}
      {job.videoUrl && (
        <Paper sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            Job-Video
          </Typography>
          <video width="100%" controls>
            <source src={job.videoUrl} type="video/mp4" />
            Ihr Browser unterstützt das Video-Tag nicht.
          </video>
        </Paper>
      )}
    </Box>
  );
};

export default RecruiterJobPage;
