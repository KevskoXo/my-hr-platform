// conversationService/routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

// Neue Konversation erstellen
router.post('/create', authMiddleware, conversationController.createConversation);

// Konversationen eines Nutzers abrufen
router.get('/', authMiddleware, conversationController.getUserConversations);

// Eine spezifische Konversation abrufen
router.get('/:id', authMiddleware, conversationController.getConversationById);

module.exports = router;
