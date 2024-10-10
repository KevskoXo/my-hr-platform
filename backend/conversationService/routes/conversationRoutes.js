// conversationService/routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const auth = require('../middleware/auth');


// Route zum Erstellen einer neuen Konversation
router.post('/create', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.createConversation);

// Route zum Abrufen der Konversationen eines Benutzers
router.get('/user/:userId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.getConversationsForUser);

// Route zum Abrufen einer bestimmten Konversation anhand der ID
router.get('/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.getConversationById);

// Route zum Aktualisieren der letzten Aktivität einer Konversation
router.put('/update/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.updateLastActivity);

// Route zum Löschen einer Konversation
router.delete('/delete/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.deleteConversation);

// Route zum Markieren einer Konversation als gelesen
router.put('/mark-as-read/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.markConversationAsRead);

module.exports = router;
