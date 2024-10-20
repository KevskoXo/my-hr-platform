// messageService/controllers/messageController.js

const Message = require('../models/messageModel');
const axios = require('axios');
const { getIO } = require('../socket'); // Importiere Socket.IO-Instanz

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
