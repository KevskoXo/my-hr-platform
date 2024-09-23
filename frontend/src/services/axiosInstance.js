import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Definition der Ports für die verschiedenen Services
const SERVICE_PORTS = {
  authentication: '5012/authentication',
  jobs: '5001/jobs', // Beispiel: Port für Job-Service
  resume: '5004/resume', // Beispiel: Port für Resume-Service
  // Weitere Services nach Bedarf hinzufügen
};

// Funktion zur dynamischen Anpassung der Base URL
const getBaseUrl = (service = 'authentication') => {
  return `http://localhost:${SERVICE_PORTS[service]}`;
};

// Funktion zum Erstellen einer Axios-Instanz
const createAxiosInstance = (service = 'authentication') => {
  const axiosInstance = axios.create({
    baseURL: getBaseUrl(service),
    withCredentials: true, // Damit Cookies (z.B. das Refresh Token) gesendet werden
  });

  // Funktion zum Überprüfen, ob das Token abgelaufen ist
  function isTokenExpired(token) {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }

  // Request-Interceptor zum Hinzufügen des Access Tokens und zur Token-Erneuerung
  axiosInstance.interceptors.request.use(
    async (config) => {
      let token = localStorage.getItem('accessToken');

      if (token && isTokenExpired(token)) {
        try {
          const response = await axios.post(`${getBaseUrl('authentication')}/refresh-token`, null, {
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

  return axiosInstance;
};

export default createAxiosInstance;
