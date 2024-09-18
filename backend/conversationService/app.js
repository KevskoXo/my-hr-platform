// conversationService/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_CONVERSATION)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
const conversationRoutes = require('./routes/conversationRoutes');
app.use('/jobs', conversationRoutes);

const PORT = process.env.PORT_CONVERSATION|| 5001; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`DefaultService running on port ${PORT}`));
