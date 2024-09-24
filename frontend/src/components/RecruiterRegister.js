import React, { useState } from 'react';
import createAxiosInstance from '../services/axiosInstance';
import { TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';

const RecruiterRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [trial, setTrial] = useState(false); // Für 14-tägiges Probeabo

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const axiosInstance = createAxiosInstance('authentication');
            const response = await axiosInstance.post('/register', { email, password, role: 'recruiter', trial });
            
            // Registration successful, navigate to login
            window.location.href = '/login';
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <Typography variant="h4" align="center">Recruiter Registration</Typography>
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={trial}
                            onChange={(e) => setTrial(e.target.checked)}
                            name="trial"
                            color="primary"
                        />
                    }
                    label="I agree to the 14-day free trial"
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

export default RecruiterRegister;
