// authenticationService/controllers/authenticationontroller.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Versuche, den Benutzer im UserService zu authentifizieren
    let userData;
    try {
      const response = await axios.post(`${process.env.USER_SERVICE_URL}/users/authenticate`, { email, password });
      userData = response.data;
    } catch (error) {
      // Wenn der UserService keinen Treffer liefert, versuche den RecruiterService
      try {
        const response = await axios.post(`${process.env.RECRUITER_SERVICE_URL}/recruiters/authenticate`, { email, password });
        userData = response.data;
      } catch (err) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
      }
    }

    // Generiere Tokens
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Setze das Refresh Token als HttpOnly-Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // In Produktion auf true setzen (HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
    });

    // Sende das Access Token zurück
    res.json({ accessToken });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
};

//token-refresh
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Kein Refresh Token vorhanden' });

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, userData) => {
    if (err) return res.status(403).json({ error: 'Ungültiges Refresh Token' });

    // Generiere neues Access Token
    const accessToken = generateAccessToken(userData);
    res.json({ accessToken });
  });
};

//logout
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Erfolgreich abgemeldet' });
};
