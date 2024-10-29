const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const auth = require('../middleware/auth');

// Create a new conversation
router.post('/create', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.createConversation);

// Get a conversation by its ID
router.get('/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.getConversationById);

// Get all conversations for a specific user
router.get('/user/:userId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.getConversationsForUser);

// Update the last activity of a conversation
router.put('/update/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.updateLastActivity);

// Delete a conversation by its ID
router.delete('/delete/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.deleteConversation);

// Mark a conversation as read
router.put('/mark-as-read/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), conversationController.markConversationAsRead);

module.exports = router;