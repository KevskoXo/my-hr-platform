// defaultService/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_MESSAGE)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
const messageRoutes = require('./routes/messageRoutes');
app.use('/jobs', messageRoutes);

const PORT = process.env.PORT_MESSAGE|| 5005; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`MessageService running on port ${PORT}`));
