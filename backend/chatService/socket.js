const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Message = require('./models/messageModel');
const { checkUserInConversation } = require('./utils/conversationUtils');

dotenv.config();

let io;

module.exports = {
  init: function (server) {
    const corsOptions = {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    io = new Server(server, {
      cors: corsOptions,
    });

    io.use((socket, next) => {
      const token = socket.handshake.query.token || socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Unauthorized: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (err) {
        console.error('Socket.IO Auth Error:', err.message);
        next(new Error('Unauthorized: Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      if (!socket.user) {
        console.error('User information is not available after authentication');
        socket.disconnect();
        return;
      }

      console.log(`User connected: ${socket.user.userId}`);

      socket.on('joinConversation', async (conversationId) => {
        try {
          const isParticipant = await checkUserInConversation(
            socket.user.userId,
            conversationId,
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (isParticipant) {
            socket.join(conversationId);
            console.log(`User ${socket.user.userId} joined conversation ${conversationId}`);
          } else {
            socket.emit('error', { message: 'Unauthorized to join this conversation' });
          }
        } catch (error) {
          console.error('Error joining conversation:', error);
          socket.emit('error', { message: 'Error joining conversation' });
        }
      });

      socket.on('sendMessage', async (data) => {
        try {
          const { conversationId, content, media, type } = data;
          const senderId = socket.user.userId;

          const isParticipant = await checkUserInConversation(
            senderId,
            conversationId,
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (!isParticipant) {
            socket.emit('error', { message: 'Unauthorized to send messages in this conversation' });
            return;
          }

          let mediaUrl = null;
          if (media) {
            // Implement logic to handle media files
          }

          const newMessage = new Message({
            conversationId,
            sender: senderId,
            content,
            media: mediaUrl,
            type,
          });

          await newMessage.save();

          // Update the last message and last activity timestamp in the conversation
          const conversation = await Conversation.findById(conversationId);
          conversation.lastMessage = newMessage._id;
          conversation.lastMessageTimestamp = new Date();
          await conversation.save();

          io.to(conversationId).emit('newMessage', newMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Error sending message' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user.userId}`);
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