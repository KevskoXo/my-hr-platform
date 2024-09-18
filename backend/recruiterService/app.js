const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
const recruiterRoutes = require('./routes/recruiterRoutes');
app.use('/recruiters', recruiterRoutes);

// Verbinde mit MongoDB
console.log(process.env.MONGO_URI_RECRUITER);
mongoose.connect(process.env.MONGO_URI_RECRUITER)
    .then(() => console.log('RecruiterService connected to MongoDB'))
    .catch(err => console.log(err));

const PORT = process.env.PORT_RECRUITER || 5002;
app.listen(PORT, () => console.log(`RecruiterService running on port ${PORT}`));