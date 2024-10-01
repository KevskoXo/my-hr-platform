import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import createAxiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SupervisorAvatar = () => {
  const [supervisor, setSupervisor] = useState(null);
  const axiosInstance = createAxiosInstance('recruiters');
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        if (!token) {
          throw new Error('Kein Token gefunden');
        }
        const response = await axiosInstance.get('/current-supervisor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSupervisor(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen des Supervisors:', error);
      }
    };

    fetchSupervisor();
  }, [axiosInstance, token]);

  if (!supervisor) return null;

  const handleSupervisorClick = () => {
    navigate(`/recruiters/${supervisor._id}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
      }}
      onClick={handleSupervisorClick}
    >
      <Avatar
        sx={{ width: 50, height: 50, ml: 3}}
        src={supervisor.avatar}
        alt={supervisor.name}
      >
        {!supervisor.avatar && supervisor.name.charAt(0)}
      </Avatar>
      <Typography variant="body1">
        {supervisor.role}: {supervisor.name}
      </Typography>
    </Box>
  );
};

export default SupervisorAvatar;
