// messageService/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Neue Nachricht senden
router.post('/send', authMiddleware, messageController.sendMessage);

// Nachrichten eines Nutzers abrufen
router.get('/', authMiddleware, messageController.getUserMessages);

// Nachrichten in einer spezifischen Konversation abrufen
router.get('/conversation/:conversationId', authMiddleware, messageController.getMessagesInConversation);

module.exports = router;
