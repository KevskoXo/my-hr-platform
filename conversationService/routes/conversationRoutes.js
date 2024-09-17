// conversationService/routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middleware/auth');

// Neue Konversation erstellen (nur für Recruiter)
router.post('/create', authMiddleware(['recruiter']), conversationController.createConversation);

// Konversationen eines Nutzers abrufen (nur für User)
router.get('/', authMiddleware(['user']), conversationController.getUserConversations);

// Eine spezifische Konversation abrufen (für User und Recruiter)
router.get('/:id', authMiddleware(['user', 'recruiter']), conversationController.getConversationById);

module.exports = router;
