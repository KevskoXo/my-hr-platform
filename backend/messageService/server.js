const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS Optionen
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

// Socket.IO Setup mit Authentifizierung
const io = new Server(server, {
  cors: corsOptions,
});

// Authentifizierung für Socket.IO-Verbindungen
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.userId; // Benutzerinformationen im Socket speichern
    next();
  } catch (err) {
    console.error('Socket.IO Auth Error:', err.message);
    next(new Error('Unauthorized: Invalid token'));
  }
});

// Socket.IO-Verbindung und Events
io.on('connection', (socket) => {
  console.log(`Benutzer verbunden: ${socket.user}`);

  socket.on('disconnect', () => {
    console.log(`Benutzer getrennt: ${socket.user}`);
  });
});

module.exports = { server, io };
