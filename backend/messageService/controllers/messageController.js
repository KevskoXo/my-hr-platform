// messageService/controllers/messageController.js

const Message = require('../models/messageModel');
const axios = require('axios');
const { getIO } = require('../socket'); // Importiere Socket.IO-Instanz

// Nachricht senden
exports.sendMessage = async (req, res) => {
    try {
        console.log('req.user:', req.user);
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        const { conversationId, content, type } = req.body;
        const senderId = req.user.userId;

        console.log('conversationId:', conversationId);
        console.log('content:', content);
        console.log('type:', type);
        console.log('senderId:', senderId);

        let mediaUrl = null;

        // Wenn eine Datei hochgeladen wurde, verarbeite sie entsprechend
        if (req.file) {
            mediaUrl = req.file.path;
            console.log('mediaUrl:', mediaUrl);
        }
        const senderType = req.user.role;

        let senderModel = 'Recruiter';

        if (senderType === 'user') {
            senderModel = 'User';
        }


        // Neue Nachricht erstellen
        const newMessage = new Message({
            sender: senderId,
            senderModel: senderModel,
            conversationId: conversationId,
            content,
            media: mediaUrl,
            type,
        });

        await newMessage.save();
        console.log('Neue Nachricht gespeichert:', newMessage);

        // Aktualisiere das „updatedAt“-Feld der Konversation
        const updateResponse = await axios.put(
            `http://localhost:${process.env.PORT_CONVERSATION}/conversations/update/${conversationId}`,
            { lastActivity: new Date() }
        );
        console.log('Conversations-Service-Antwort:', updateResponse.data);

        // Sende die Nachricht an alle Teilnehmer in Echtzeit
        const io = getIO();
        io.to(conversationId).emit('newMessage', newMessage);

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('Fehler in sendMessage:', error);
        return res.status(500).json({ error: error.message });
    }
};


// Nachrichten einer Konversation abrufen
exports.getMessagesByConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;
      
      console.log('Received Conversation ID:', conversationId); // Debug-Ausgabe
  
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

  
      if (!messages.length) {
        //return res.status(404).json({ error: 'No messages found for this conversation' });
      }
  
      console.log('Messages:', messages); // Debug-Ausgabe
  
      // Überprüfe, ob die Nachrichten serialisierbar sind
      try {
        res.status(200).json(messages);
      } catch (serializationError) {
        console.error('Serialization error:', serializationError);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error serializing messages' });
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error fetching messages' });
      } else {
        console.error('Headers were already sent. Cannot send response.');
      }
    }
  };

exports.hallo = async (req, res) => {
    res.status(200).send('safe');
}



// Nachricht als gelesen markieren
exports.markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.receiver.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        message.read = true;
        await message.save();

        res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Nachricht löschen
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Message.findByIdAndDelete(messageId);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Nachricht bearbeiten
exports.editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { newContent } = req.body;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        message.content = newContent;
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reaktion hinzufügen
exports.addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        message.reactions.push({ user: userId, reaction });
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reaktion entfernen
exports.removeReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;
        const userId = req.user.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== userId || r.reaction !== reaction
        );
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Schreibstatus setzen
exports.setTypingStatus = (req, res) => {
    const { conversationId, isTyping } = req.body;
    const userId = req.user.userId;

    // Sende den Schreibstatus an alle Teilnehmer der Konversation
    io.to(conversationId).emit('typingStatus', { userId, isTyping });

    res.status(200).json({ message: 'Typing status updated' });
};