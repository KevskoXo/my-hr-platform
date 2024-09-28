// companyService/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const companyRoutes = require('./routes/companyRoutes');

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// CORS-Konfiguration
app.use(cors({
    origin: 'http://localhost:3000', // URL deines Frontends
    credentials: true,
  }));
  

// Verbinde mit der MongoDB-Datenbank für Unternehmen
console.log(process.env.MONGO_URI_COMPANY);
mongoose.connect(process.env.MONGO_URI_COMPANY)
    .then(() => console.log('Company DB connected'))
    .catch(err => console.log(err));

// Verwende die Routen
app.use('/companies', companyRoutes);

const PORT = process.env.PORT_COMPANY || 5003;
app.listen(PORT, () => console.log(`CompanyService running on port ${PORT}`));
