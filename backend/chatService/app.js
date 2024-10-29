// app.js

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
// CORS-Konfiguration
const corsOptions = {
  origin: 'http://localhost:3000', // Setze die URL des Frontends ein
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Cookies und andere Credentials erlauben
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI_CHAT)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Socket.io
socket.init(server);

// Start the server
const PORT_CHAT = process.env.PORT_CHAT || 5013;
server.listen(PORT_CHAT, () => {
  console.log(`Server running on port ${PORT_CHAT}`);
});