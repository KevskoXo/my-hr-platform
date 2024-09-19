// src/components/login.js
import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login', { email, password });
            console.log('Login erfolgreich:', response.data); // Debug-Info
            localStorage.setItem('accessToken', response.data.accessToken);
            setError(null);
            window.location.href = '/protected'; // Nach erfolgreichem Login weiterleiten
        } catch (err) {
            console.error('Login-Fehler:', err.response ? err.response.data : err.message); // Debug-Info
            setError('Invalid credentials');
        }
    };
    

    return ( 
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
