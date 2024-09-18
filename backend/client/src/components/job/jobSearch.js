import React, { useState } from 'react';
import axios from 'axios';

const JobSearch = () => {
    const [query, setQuery] = useState('');
    const [jobs, setJobs] = useState([]);

    const handleSearch = () => {
        axios.get(`http://localhost:5001/search?title=${query}`)
            .then(response => setJobs(response.data))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search for jobs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
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

export default JobSearch;