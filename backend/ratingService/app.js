const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const ratingRoutes = require('./routes/ratingRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/ratings', ratingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI_RATING)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT_RATING || 5014;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});