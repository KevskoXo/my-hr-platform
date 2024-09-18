import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/')
            .then(response => setJobs(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Job Listings</h1>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        <h2>{job.title}</h2>
                        <p>{job.location}</p>
                        <p>{job.industry}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;