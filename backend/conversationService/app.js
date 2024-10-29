// conversationService/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// CORS-Konfiguration
const corsOptions = {
  origin: 'http://localhost:3000', // Setze die URL des Frontends ein
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Cookies und andere Credentials erlauben
};
app.use(cors(corsOptions));

// Middleware für JSON-Parsing
app.use(express.json());

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_CONVERSATION)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
const conversationRoutes = require('./routes/conversationRoutes');
app.use('/conversations', conversationRoutes);

const PORT = process.env.PORT_CONVERSATION || 5006; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`ConversationService running on port ${PORT}`));
