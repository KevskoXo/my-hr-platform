// src/services/authService.js
import axios from 'axios';

// Erstelle eine Axios-Instanz
const api = axios.create({
    baseURL: 'http://localhost:5012',
    withCredentials: true, // Erlaubt das Senden von Http-Cookies
});

// Token-Refresh-Logik
api.interceptors.response.use(
    response => response, // Bei erfolgreichen Antworten, nichts tun
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Rufe das Refresh Token vom Server ab
                const response = await axios.post('http://localhost:5012/refresh-token', {}, {
                    withCredentials: true, // Http-Cookie für das Refresh-Token
                });
                localStorage.setItem('accessToken', response.data.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                return api(originalRequest); // Erneut mit neuem Token versuchen
            } catch (refreshError) {
                console.error('Token-Refresh fehlgeschlagen', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
