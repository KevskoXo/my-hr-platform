// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const messageRoutes = require('./routes/messageRoutes');

dotenv.config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Stelle sicher, dass das Upload-Verzeichnis existiert
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// CORS-Konfiguration
const corsOptions = {
  origin: 'http://localhost:3000', // Ersetze dies durch die URL deiner Frontend-Anwendung
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Ermöglicht das Senden von Cookies und anderen Credentials
};

app.use(cors(corsOptions)); // Wende die CORS-Optionen an

// Middleware für JSON-Parsing
app.use(express.json());

// Statische Dateien bereitstellen (für hochgeladene Medien)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_MESSAGE)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routen
app.use('/messages', messageRoutes);

// Exportiere die App, damit sie in server.js verwendet werden kann
module.exports = app;
