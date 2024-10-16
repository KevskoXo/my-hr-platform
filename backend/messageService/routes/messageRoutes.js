// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth'); // Authentifizierungs-Middleware
const multer = require('multer');
//const upload = require('../middleware/upload'); // Upload-Middleware
const upload = multer({ dest: 'uploads/' });

// Nachricht senden
router.post('/send', auth(['user', 'admin', 'recruiter', 'superAdmin']), upload.single('media'), messageController.sendMessage);

// Nachrichten einer Konversation abrufen
//router.get('/conversation/:conversationId', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.getMessagesByConversation);

router.get('/conversation/:conversationId', messageController.getMessagesByConversation);

router.get('/hallo', messageController.hallo);

// Nachricht als gelesen markieren
router.patch('/:messageId/read', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.markMessageAsRead);

// Nachricht löschen
router.delete('/:messageId', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.deleteMessage);

// Nachricht bearbeiten
router.patch('/:messageId/edit', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.editMessage);

// Reaktion hinzufügen
router.post('/:messageId/reaction', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.addReaction);

// Reaktion entfernen
router.delete('/:messageId/reaction', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.removeReaction);

// Schreibstatus setzen
router.post('/typing', auth(['user', 'admin', 'recruiter', 'superAdmin']), messageController.setTypingStatus);



module.exports = router;
