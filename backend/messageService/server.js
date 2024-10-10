// server.js

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
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

// Socket.IO Setup mit Authentifizierung
const io = new Server(server, {
  cors: corsOptions,
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error('Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Benutzerinformationen im Socket speichern
    next();
  } catch (err) {
    console.error('Socket.IO Auth Error:', err.message);
    next(new Error('Unauthorized: Invalid token'));
  }
});

module.exports = { server, io };
