import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import createAxiosInstance from '../services/axiosInstance';

const CompanyDetails = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const axiosInstance = createAxiosInstance('companies');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axiosInstance.get(`/${companyId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setCompany(response.data);
      } catch (error) {
        console.error('Fehler beim Laden der Firmeninformationen:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyId, axiosInstance]);

  if (!company) return null;

  return (
    <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={company.logoUrl}
          alt={company.name}
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {company.name}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {company.shortDescription}
          </Typography>
          {!showFullDescription ? (
            <Button
              onClick={() => setShowFullDescription(true)}
              startIcon={<ExpandMoreIcon />}
              sx={{ mt: 1 }}
            >
              Mehr anzeigen
            </Button>
          ) : (
            <>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {company.longDescription}
              </Typography>
              <Button
                onClick={() => setShowFullDescription(false)}
                startIcon={<ExpandLessIcon />}
                sx={{ mt: 1 }}
              >
                Weniger anzeigen
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyDetails;
