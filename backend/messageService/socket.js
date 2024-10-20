// socket.js

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Message = require('./models/messageModel');
const axios = require('axios');

dotenv.config();

let io;

module.exports = {
  init: function (server) {
    // CORS-Optionen
    const corsOptions = {
      origin: 'http://localhost:3000', // Passe dies an deine Frontend-URL an
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    // Initialisiere Socket.IO
    io = new Server(server, {
      cors: corsOptions,
    });

    // Authentifizierungsmiddleware für Socket.IO-Verbindungen
    io.use((socket, next) => {
      const token = socket.handshake.query.token || socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Unauthorized: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Enthält userId und ggf. weitere Informationen
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

      console.log(`Benutzer verbunden: ${socket.user.userId}`);

      // Event zum Beitreten zu einer Konversation
      socket.on('joinConversation', async (conversationId) => {
        try {
          // Überprüfe, ob der Benutzer Teilnehmer der Konversation ist
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

      // Event zum Senden einer Nachricht
      socket.on('sendMessage', async (data) => {
        try {
          const { conversationId, content, media, type } = data;
          const senderId = socket.user.userId;

          // Überprüfe, ob der Benutzer Teilnehmer der Konversation ist
          const isParticipant = await checkUserInConversation(
            senderId,
            conversationId,
            socket.handshake.query.token || socket.handshake.auth.token
          );
          if (!isParticipant) {
            socket.emit('error', { message: 'Unauthorized to send messages in this conversation' });
            return;
          }

          // Media-Datei verarbeiten (falls vorhanden)
          let mediaUrl = null;
          if (media) {
            // Implementiere die Logik zum Speichern der Datei und erhalte die URL
            // Zum Beispiel:
            // mediaUrl = await saveMediaFile(media);
          }

          // Neue Nachricht erstellen
          const newMessage = new Message({
            sender: senderId,
            senderModel: socket.user.role === 'user' ? 'User' : 'Recruiter',
            conversationId,
            content,
            media: mediaUrl,
            type,
          });

          await newMessage.save();

          // Aktualisiere das `updatedAt`-Feld der Konversation
          await axios.put(
            `${process.env.CONVERSATION_SERVICE_URL}/update/${conversationId}`,
            { lastActivity: new Date() },
            {
              headers: {
                Authorization: `Bearer ${socket.handshake.query.token || socket.handshake.auth.token}`,
              },
            }
          );

          // Sende die Nachricht an alle Teilnehmer in Echtzeit
          io.to(conversationId).emit('newMessage', newMessage);
        } catch (error) {
          console.error('Fehler beim Senden der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Senden der Nachricht' });
        }
      });

      // Event für den Schreibstatus (Tippen)
      socket.on('typing', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('typing', { senderId: socket.user.userId, conversationId });
      });

      socket.on('stopTyping', (data) => {
        const { conversationId } = data;
        socket.to(conversationId).emit('stopTyping', { senderId: socket.user.userId, conversationId });
      });

      // Nachricht bearbeiten
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

          // Benachrichtige alle Teilnehmer über die aktualisierte Nachricht
          io.to(message.conversationId.toString()).emit('messageEdited', message);
        } catch (error) {
          console.error('Fehler beim Bearbeiten der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Bearbeiten der Nachricht' });
        }
      });

      // Nachricht löschen
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

          // Benachrichtige alle Teilnehmer über die gelöschte Nachricht
          io.to(message.conversationId.toString()).emit('messageDeleted', { messageId });
        } catch (error) {
          console.error('Fehler beim Löschen der Nachricht:', error);
          socket.emit('error', { message: 'Fehler beim Löschen der Nachricht' });
        }
      });

      // Reaktion hinzufügen
      socket.on('addReaction', async (data) => {
        const { messageId, reaction } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Stelle sicher, dass der Benutzer Teilnehmer der Konversation ist
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

          // Benachrichtige alle Teilnehmer über die neue Reaktion
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

      // Reaktion entfernen
      socket.on('removeReaction', async (data) => {
        const { messageId, reaction } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Stelle sicher, dass der Benutzer Teilnehmer der Konversation ist
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

          // Benachrichtige alle Teilnehmer über die entfernte Reaktion
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

      // Lesebestätigung
      socket.on('markMessageAsRead', async (data) => {
        const { messageId } = data;
        const userId = socket.user.userId;

        try {
          const message = await Message.findById(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Stelle sicher, dass der Benutzer Teilnehmer der Konversation ist
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

            // Benachrichtige die Teilnehmer über die Lesebestätigung
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

      // Benutzer trennt die Verbindung
      socket.on('disconnect', () => {
        console.log(`Benutzer getrennt: ${socket.user.userId}`);
      });
    });

    // Hilfsfunktion, um zu überprüfen, ob der Benutzer Teilnehmer der Konversation ist
    async function checkUserInConversation(userId, conversationId, token) {
      try {
        const response = await axios.get(
          `${process.env.CONVERSATION_SERVICE_URL}/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const conversation = response.data;
        return conversation.participants.includes(userId);
      } catch (error) {
        console.error(
          'Fehler beim Überprüfen der Konversationsteilnahme:',
          error.response ? error.response.data : error.message
        );
        return false;
      }
    }

    return io;
  },

  getIO: function () {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
