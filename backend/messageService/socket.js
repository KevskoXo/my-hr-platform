// socket.js

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

      console.log(`Benutzer verbunden: ${socket.user.userId}`);

      socket.on('joinConversation', async (conversationId) => {
        try {
          const isParticipant = await checkUserInConversation(
            socket.user.userId,
            conversationId,
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (isParticipant) {
            socket.join(conversationId);
            console.log(`Benutzer ${socket.user.userId} ist der Konversation ${conversationId} beigetreten`);
          } else {
            socket.emit('error', { message: 'Unauthorized to join this conversation' });
          }
        } catch (error) {
          console.error('Fehler beim Beitreten zur Konversation:', error);
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
            // Implementiere die Logik zum Speichern der Datei und erhalte die URL
            // Zum Beispiel:
            // mediaUrl = await saveMediaFile(media);
          }

          const newMessage = new Message({
            sender: senderId,
            senderModel: socket.user.role === 'user' ? 'User' : 'Recruiter',
            conversationId,
            content,
            media: mediaUrl,
            type,
          });

          await newMessage.save();

          await axios.put(
            `${process.env.CONVERSATION_SERVICE_URL}/update/${conversationId}`,
            { lastActivity: new Date() },
            {
              headers: {
                Authorization: `Bearer ${socket.handshake.query.token || socket.handshake.auth.token}`,
              },
            }
          );

          io.to(conversationId).emit('newMessage', newMessage);
        } catch (error) {
          console.error('Fehler beim Senden der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Senden der Nachricht' });
        }
      });

      socket.on('typing', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('typing', { senderId: socket.user.userId, conversationId });
      });

      socket.on('stopTyping', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('stopTyping', { senderId: socket.user.userId, conversationId });
      });

      socket.on('editMessage', async (data) => {
        const { messageId, newContent } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          if (message.sender.toString() !== userId) {
            socket.emit('error', { message: 'Unauthorized' });
            return;
          }

          message.content = newContent;
          await message.save();

          io.to(message.conversationId.toString()).emit('messageEdited', message);
        } catch (error) {
          console.error('Fehler beim Bearbeiten der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Bearbeiten der Nachricht' });
        }
      });

      socket.on('deleteMessage', async (data) => {
        const { messageId } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          if (message.sender.toString() !== userId) {
            socket.emit('error', { message: 'Unauthorized' });
            return;
          }

          await Message.findByIdAndDelete(messageId);

          io.to(message.conversationId.toString()).emit('messageDeleted', { messageId });
        } catch (error) {
          console.error('Fehler beim Löschen der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Löschen der Nachricht' });
        }
      });

      socket.on('addReaction', async (data) => {
        const { messageId, reaction } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          const isParticipant = await checkUserInConversation(
            userId,
            message.conversationId.toString(),
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (!isParticipant) {
            socket.emit('error', { message: 'Unauthorized to react to messages in this conversation' });
            return;
          }

          message.reactions.push({ user: userId, reaction });
          await message.save();

          io.to(message.conversationId.toString()).emit('reactionAdded', {
            messageId,
            userId,
            reaction,
          });
        } catch (error) {
          console.error('Fehler beim Hinzufügen der Reaktion:', error);
          socket.emit('error', { message: 'Fehler beim Hinzufügen der Reaktion' });
        }
      });

      socket.on('removeReaction', async (data) => {
        const { messageId, reaction } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          const isParticipant = await checkUserInConversation(
            userId,
            message.conversationId.toString(),
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (!isParticipant) {
            socket.emit('error', { message: 'Unauthorized to remove reactions in this conversation' });
            return;
          }

          message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== userId || r.reaction !== reaction
          );
          await message.save();

          io.to(message.conversationId.toString()).emit('reactionRemoved', {
            messageId,
            userId,
            reaction,
          });
        } catch (error) {
          console.error('Fehler beim Entfernen der Reaktion:', error);
          socket.emit('error', { message: 'Fehler beim Entfernen der Reaktion' });
        }
      });

      socket.on('markMessageAsRead', async (data) => {
        const { messageId } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          const isParticipant = await checkUserInConversation(
            userId,
            message.conversationId.toString(),
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (!isParticipant) {
            socket.emit('error', { message: 'Unauthorized to mark messages in this conversation' });
            return;
          }

          if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
            await message.save();

            io.to(message.conversationId.toString()).emit('messageRead', {
              messageId,
              readerId: userId,
            });
          }
        } catch (error) {
          console.error('Fehler beim Markieren der Nachricht als gelesen:', error);
          socket.emit('error', { message: 'Fehler beim Markieren der Nachricht als gelesen' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`Benutzer getrennt: ${socket.user.userId}`);
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