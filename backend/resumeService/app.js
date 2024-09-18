// defaultService/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/resume', resumeRoutes);

// Verbinde mit MongoDB
console.log(process.env.MONGO_URI_RESUME);
mongoose.connect(process.env.MONGO_URI_RESUME)
    .then(() => console.log('ResumeService connected to MongoDB'))
    .catch(err => console.log(err));

const PORT = process.env.PORT_RESUME || 5002;
app.listen(PORT, () => console.log(`ResumeService running on port ${PORT}`));
