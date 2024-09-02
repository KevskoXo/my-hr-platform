const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Verbinde mit MongoDB
console.log(process.env.MONGO_URI_USERS);
mongoose.connect(process.env.MONGO_URI_USERS)
    .then(() => console.log('UserService: MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT_USERS || 5000;
app.listen(PORT, () => console.log(`UserService running on port ${PORT}`));
