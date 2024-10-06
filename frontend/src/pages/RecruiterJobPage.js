import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import createAxiosInstance from '../services/axiosInstance';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BackButton from '../components/BackButton';

const RecruiterJobPage = ({ userRole }) => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const axiosInstance = createAxiosInstance('jobs');
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

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
      <BackButton/>

      {/* Oberer Bereich mit CompanyAvatar und Jobtitel */}
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
              {job.location} • {new Date(job.datePosted).toLocaleDateString()}
            </Typography>
          </Grid>
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
              {job.startDate ? new Date(job.startDate).toLocaleDateString() : 'Nicht angegeben'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="textSecondary">
              <strong>Gehalt:</strong>
            </Typography>
            <Typography variant="body1">
              {job.salary || 'Nicht angegeben'}
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

      {/* Bearbeiten-Button */}
      {(userRole === 'recruiter' || userRole === 'admin' || userRole === 'superAdmin') && (
        <Button variant="contained" color="primary" onClick={() => navigate(`/jobs/${jobId}/edit`)}>
          Job bearbeiten
        </Button>
      )}
    </Box>
  );
};

export default RecruiterJobPage;
