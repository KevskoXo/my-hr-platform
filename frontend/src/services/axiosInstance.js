// src/services/axiosInstance.js
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Basis-URL deines Backends
const API_BASE_URL = 'http://localhost:5000'; // Passe die URL an

// Erstelle eine Axios-Instanz
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Damit Cookies (z.B. das Refresh Token) gesendet werden
});

// Funktion zum Überprüfen, ob das Token abgelaufen ist
function isTokenExpired(token) {
  if (!token) return true;
  const decoded = jwt_decode(token);
  return decoded.exp * 1000 < Date.now();
}

// Request-Interceptor zum Hinzufügen des Access Tokens und zur Token-Erneuerung
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');

    if (token && isTokenExpired(token)) {
      try {
        const response = await axios.post(`${API_BASE_URL}/refresh-token`, null, {
          withCredentials: true,
        });
        token = response.data.accessToken;
        localStorage.setItem('accessToken', token);
      } catch (error) {
        console.error('Token-Erneuerung fehlgeschlagen:', error);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
