const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');

// Bewerbungsgespräch planen
router.post('/schedule', authMiddleware, videoController.scheduleInterview);

// Alle geplanten Interviews abrufen
router.get('/', authMiddleware, videoController.getAllInterviews);

// Spezifisches Interview abrufen
router.get('/:id', authMiddleware, videoController.getInterviewById);

// Meeting beitreten
router.get('/join/:id', authMiddleware, videoController.joinMeeting);

module.exports = router;
