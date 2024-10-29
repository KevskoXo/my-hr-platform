const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth(['user', 'recruiter', 'admin', 'superAdmin']), messageController.sendMessage);
router.get('/:conversationId', auth(['user', 'recruiter', 'admin', 'superAdmin']), messageController.getMessagesForConversation);

module.exports = router;