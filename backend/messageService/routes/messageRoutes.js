// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth'); // Authentifizierungs-Middleware
const upload = require('../middleware/upload'); // Upload-Middleware

// Route zum Senden einer Nachricht mit Datei-Upload
router.post('/send', auth(['superAdmin', 'recruiter', 'admin', 'user']), upload.single('media'), messageController.sendMessage);

// Route zum Abrufen von Nachrichten zwischen zwei Benutzern
router.get('/:otherUserId/messages', auth(['superAdmin', 'recruiter', 'admin', 'user']), messageController.getMessages);

// Route zum Markieren einer Nachricht als gelesen
router.put('/:messageId/read', auth(['superAdmin', 'recruiter', 'admin', 'user']), messageController.markAsRead);

// Route zum Hinzufügen einer Reaktion zu einer Nachricht
router.post('/:messageId/reactions', auth(['superAdmin', 'recruiter', 'admin', 'user']), messageController.addReaction);

// Route zum Abrufen der Konversationen des aktuellen Benutzers
router.get('/conversations', auth(['superAdmin', 'recruiter', 'admin', 'user']), messageController.getConversations);

module.exports = router;
