// messageService/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Neue Nachricht senden (nur für Recruiter)
router.post('/send', auth(['recruiter']), messageController.sendMessage);

// Nachrichten eines Nutzers abrufen (nur für User)
router.get('/', auth(['user']), messageController.getUserMessages);

// Nachrichten in einer spezifischen Konversation abrufen (für User und Recruiter)
router.get('/conversation/:conversationId', auth(['user', 'recruiter']), messageController.getMessagesInConversation);

module.exports = router;
