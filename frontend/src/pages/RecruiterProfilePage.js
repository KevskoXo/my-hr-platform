// pages/RecruiterProfilePage.js

import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import HierarchyTreeView from '../components/HierarchyTreeView';
import createAxiosInstance from '../services/axiosInstance';


const RecruiterProfilePage = () => {
    const [hierarchyData, setHierarchyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = createAxiosInstance('recruiters');
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchHierarchyData = async () => {
            try {
                const response = await axiosInstance.get('/hierarchy', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHierarchyData(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Hierarchie-Daten:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHierarchyData();
    }, [axiosInstance]);

    if (loading) return <Typography>Lade Hierarchie...</Typography>;
    if (!hierarchyData) return <Typography>Keine Hierarchiedaten verfügbar.</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Organisatorische Hierarchie
            </Typography>
            <HierarchyTreeView hierarchyData={hierarchyData} />
        </Box>
    );
};

export default RecruiterProfilePage;
