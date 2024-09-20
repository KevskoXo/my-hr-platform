import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { TextField, Button, Typography } from '@mui/material'; // Material-UI-Komponenten
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap für das Layout einbinden

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Verhindert, dass die Seite bei Formular-Übermittlung neu geladen wird
        try {
            const response = await axiosInstance.post('/login', { email, password });
            localStorage.setItem('accessToken', response.data.accessToken);
            setError(null);
            window.location.href = '/protected'; // Nach erfolgreichem Login weiterleiten
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5"> {/* Bootstrap Container */}
            <div className="row justify-content-center"> {/* Bootstrap Row für horizontale Ausrichtung */}
                <div className="col-md-6"> {/* Bootstrap Spalte für eine mittige Ausrichtung */}
                    <Typography variant="h4" component="h2" align="center">Login</Typography> {/* Material-UI für Titel */}
                    <form onSubmit={handleSubmit}> {/* React Formular-Handling */}
                        <TextField 
                            label="Email" 
                            fullWidth 
                            margin="normal" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        /> {/* Material-UI Textfeld für Email */}
                        <TextField 
                            label="Password" 
                            type="password" 
                            fullWidth 
                            margin="normal" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        /> {/* Material-UI Textfeld für Passwort */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            style={{ marginTop: '20px' }}
                        >
                            Login
                        </Button> {/* Material-UI Button */}
                        {error && <Typography color="error" align="center" mt={2}>{error}</Typography>} {/* Material-UI Fehlernachricht */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
