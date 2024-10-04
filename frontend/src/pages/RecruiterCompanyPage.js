// src/pages/RecruiterCompanyPage.js

import React from 'react';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';
import CompanyDetails from '../components/CompanyDetails';
import { jwtDecode } from 'jwt-decode';
import ProfileIcon from '../components/ProfileIcon';
import MyJobs from '../components/MyJobs';
import { Box, Typography } from '@mui/material';

const RecruiterCompanyPage = () => {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('accessToken');
  const decoded = jwtDecode(token);

  return (
    <div>
      {/* Profil-Icon rechts oben */}
      <ProfileIcon userRole={userRole} />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Firmenprofil
        </Typography>
        <CompanyDetails companyId={decoded.company} />

        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          Manage Jobs
        </Typography>
        {userRole === 'superAdmin' && (
          <>
            <Typography variant="body1">
              Sie sehen alle Jobs der Firma.
            </Typography>
            <MyJobs userRole={userRole} />
          </>
        )}
        {userRole === 'admin' && (
          <>
            <Typography variant="body1">
              Sie sehen Ihre eigenen Jobs und die der Recruiter Ihrer Firma.
            </Typography>
            <MyJobs userRole={userRole} />
          </>
        )}
        {userRole === 'recruiter' && (
          <>
            <Typography variant="body1">Sie sehen Ihre eigenen Jobs.</Typography>
            <MyJobs userRole={userRole} />
          </>
        )}
        {userRole === 'viewer' && (
          <>
            <Typography variant="body1">
              Sie sehen die Jobs, denen Sie zugewiesen sind.
            </Typography>
            <MyJobs userRole={userRole} />
          </>
        )}
      </Box>
      <RecruiterNavigationBar />
    </div>
  );
};

export default RecruiterCompanyPage;
