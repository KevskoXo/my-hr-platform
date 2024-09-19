const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // URL deines Frontends
    credentials: true,
}));

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
