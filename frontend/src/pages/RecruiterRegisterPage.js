import React, { useState } from 'react';
import createAxiosInstance from '../services/axiosInstance';
import { TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import BackButton from '../components/BackButton';

const RecruiterRegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeToTrial, setAgreeToTrial] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const secretToken = 'SuperAdmin';
            const axiosInstance = createAxiosInstance('recruiters');
            const response = await axiosInstance.post('/register-superadmin', { name, email, password, secretToken });
            
            // Registration successful, navigate to profile
            window.location.href = '/recruiter/profile';
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <Typography variant="h4" align="center">Recruiter Registration</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                            checked={agreeToTrial}
                            onChange={(e) => setAgreeToTrial(e.target.checked)}
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
                    disabled={!agreeToTrial} // Button wird nur aktiviert, wenn der Recruiter dem Probeabo zustimmt
                >
                    Register
                </Button>
                {error && <Typography color="error" align="center">{error}</Typography>}
            </form>
            <BackButton/>
        </div>
    );
};

export default RecruiterRegisterPage;
