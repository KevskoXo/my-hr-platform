// reportingService/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_REPORTING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
const reportingRoutes = require('./routes/reportingRoutes');
app.use('/reporting', reportingRoutes);

const PORT = process.env.PORT_REPORTING|| 5010; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`ReportingService running on port ${PORT}`));
