// authenticationService/app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authenticationRoutes = require('./routes/authenticationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS-Konfiguration
app.use(cors({
  origin: 'http://localhost:3000', // URL deines Frontends
  credentials: true,
}));

// Routen
app.use('/authentication', authenticationRoutes);

// Start des Servers
const PORT = process.env.PORT_AUTHENTICATION || 5012;
app.listen(PORT, () => {
  console.log(`AuthenticationService läuft auf Port ${PORT}`);
});
