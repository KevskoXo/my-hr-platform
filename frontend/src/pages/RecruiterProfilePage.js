// pages/RecruiterProfilePage.js

import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import HierarchyTreeView from '../components/HierarchyTreeView';
import createAxiosInstance from '../services/axiosInstance';
import RecruiterNavigationBar from '../components/RecruiterNavigationBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AvatarPlusIcon from '../components/AvatarPlusIcon';
import SupervisorAvatar from '../components/SupervisorAvatar';

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
        <DndProvider backend={HTML5Backend}>
            <div>
                <h1>Recruiter Profile</h1>
                <h2>Manage Recruiter</h2>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Organisatorische Hierarchie
                    </Typography>
                    {localStorage.getItem('role') === 'admin' && <SupervisorAvatar/>}
                    {localStorage.getItem('role') === 'recruiter' && <SupervisorAvatar/>}
                    <HierarchyTreeView hierarchyData={hierarchyData} />
                    <RecruiterNavigationBar/>
                </Box>
                <AvatarPlusIcon userRole={localStorage.getItem('role')}/>
            </div>
        </DndProvider>
    );
};

export default RecruiterProfilePage;
