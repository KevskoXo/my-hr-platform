// socket.js

let io;

module.exports = {
  init: function (server) {
    const { Server } = require('socket.io');
    const jwt = require('jsonwebtoken');
    const dotenv = require('dotenv');
    const Message = require('./models/messageModel'); // Importiere das Message-Modell
    const axios = require('axios'); // Falls benötigt
    dotenv.config();

    // CORS Optionen
    const corsOptions = {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    io = new Server(server, {
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
        socket.user = decoded.userId;
        next();
      } catch (err) {
        console.error('Socket.IO Auth Error:', err.message);
        next(new Error('Unauthorized: Invalid token'));
      }
    });

    // Socket.IO-Verbindung und Events
    io.on('connection', (socket) => {
      if (!socket.user) {
        console.error('User information is not available after authentication');
        socket.disconnect();
        return;
      }

      console.log(`Benutzer verbunden: ${socket.user}`);

      socket.join(socket.user);

      // Event zum Empfangen von Nachrichten
      socket.on('sendMessage', async (data) => {
        const { receiverId, content, jobId, media, type } = data;
        const senderId = socket.user;

        if (!receiverId && !media) {
          console.error('Receiver ID or media is required to send a message');
          return;
        }

        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content: content || '',
          jobId: jobId || null,
          media: media || '',
          type: type || 'text',
        });

        try {
          await newMessage.save();

          // Sende die Nachricht an den Empfänger
          io.to(receiverId.toString()).emit('receiveMessage', newMessage);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      // Weitere Events...

      socket.on('disconnect', () => {
        console.log(`Benutzer getrennt: ${socket.user}`);
      });
    });

    return io;
  },
  getIO: function () {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
