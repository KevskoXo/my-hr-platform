// zoomService/app.js

const express = require('express');
require('dotenv').config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Routen
const zoomRoutes = require('./routes/zoomRoutes');
app.use('/zoom', zoomRoutes);

const PORT = process.env.PORT_ZOOM|| 5009; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`ZoomService running on port ${PORT}`));
