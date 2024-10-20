// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth'); // Authentifizierungs-Middleware


// Nachrichten einer Konversation abrufen
router.get('/conversation/:conversationId', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.getMessagesByConversation);

module.exports = router;
