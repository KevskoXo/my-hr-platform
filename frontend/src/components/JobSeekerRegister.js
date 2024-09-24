import React, { useState } from 'react';
import createAxiosInstance from '../services/axiosInstance';
import { TextField, Button, Typography } from '@mui/material';

const JobSeekerRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const axiosInstance = createAxiosInstance('authentication');
            const response = await axiosInstance.post('/register', { email, password, role: 'jobseeker' });
            
            // Registration successful, navigate to login
            window.location.href = '/login';
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <Typography variant="h4" align="center">JobSeeker Registration</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    Register
                </Button>
                {error && <Typography color="error" align="center">{error}</Typography>}
            </form>
        </div>
    );
};

export default JobSeekerRegister;
