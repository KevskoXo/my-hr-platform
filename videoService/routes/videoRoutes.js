// videoService/routes/videoRoutes.js

const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Bewerbungsgespräch planen (nur für Recruiter)
router.post('/schedule', auth(['recruiter']), videoController.scheduleInterview);

// Alle geplanten Interviews abrufen (für User und Recruiter)
router.get('/', auth(['user', 'recruiter']), videoController.getAllInterviews);

// Spezifisches Interview abrufen (für User und Recruiter)
router.get('/:id', auth(['user', 'recruiter']), videoController.getInterviewById);

// Meeting beitreten (für User und Recruiter)
router.get('/join/:id', auth(['user', 'recruiter']), videoController.joinMeeting);

module.exports = router;
