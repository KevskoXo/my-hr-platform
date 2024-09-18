const express = require('express');
const mongoose = require('mongoose');
const videoRoutes = require('./routes/videoRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_VIDEO)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routen
app.use('/jobs', videoRoutes);

const PORT = process.env.PORT_VIDEO|| 5008; // Ein anderer Port als der User Service
app.listen(PORT, () => console.log(`VideoService running on port ${PORT}`));
