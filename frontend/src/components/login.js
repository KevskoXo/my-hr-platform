import React, { useState } from 'react';
import createAxiosInstance from '../services/axiosInstance';
import { TextField, Button, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate Hook initialisieren

    const axiosInstance = createAxiosInstance('authentication');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', { email, password });
            const { accessToken } = response.data; // Zugangstoken und Rolle erhalten
            const decodedToken = jwtDecode(accessToken);// Token dekodieren und Rolle extrahieren
            const role = decodedToken.role; // Rolle aus dem Token extrahieren

            //Im local storage speichern
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', role);
            setError(null);

            // Je nach Rolle auf verschiedene Seiten weiterleiten
            if (role === 'recruiter') {
                window.location.href = '/recruiter/dashboard'; // Recruiter Dashboard
            } else {
                window.location.href = '/dashboard'; // User Dashboard
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Typography variant="h4" component="h2" align="center">Login</Typography>
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
                            Login
                        </Button>
                        {error && <Typography color="error" align="center" mt={2}>{error}</Typography>}
                        {/* Register-Button */}
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            style={{ marginTop: '10px' }}
                            onClick={() => navigate('/register')}  // Navigiert zur Registrierungsseite
                            >
                            Register
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
