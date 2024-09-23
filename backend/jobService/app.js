// jobService/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei


const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// CORS-Konfiguration
app.use(cors({
    origin: 'http://localhost:3000', // URL deines Frontends
    credentials: true,
  }));
  

// Verbinde mit MongoDB
console.log(process.env.MONGO_URI_JOBS);
mongoose.connect(process.env.MONGO_URI_JOBS)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
const jobRoutes = require('./routes/jobRoutes');
app.use('/jobs', jobRoutes);

const PORT = process.env.PORT_JOBS || 5001; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`JobService running on port ${PORT}`));
