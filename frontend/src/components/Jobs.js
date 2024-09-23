import React, { useEffect, useState } from 'react';
import createAxiosInstance from '../services/axiosInstance';
import { Typography, Button } from '@mui/material';
import NavigationBar from './NavigationBar';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const axiosInstance = createAxiosInstance('jobs');
    useEffect(() => {
        // Jobs abrufen
        axiosInstance.get('/')
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
            });
    }, []);

    return (
        <div>
        <h1>Jobs</h1>
        {
                <div className="container mt-5">
                <Typography variant="h4" component="h2" align="center">Available Jobs</Typography>
                <div className="mt-4">
                    {jobs.length > 0 ? (
                        <ul>
                            {jobs.map(job => (
                                <li key={job._id}>{job.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="body1">No jobs found.</Typography>
                    )}
                </div>
            </div>
        }
        <NavigationBar />
        </div>

    );
};

export default Jobs;
