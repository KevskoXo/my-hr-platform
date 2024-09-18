const express = require('express');
const router = express.Router();
const zoomController = require('../controllers/zoomController');

// Route zur Weiterleitung zur Zoom-Autorisierungsseite
router.get('/auth', zoomController.redirectToZoomAuth);

// Route zum Verarbeiten des Zoom-OAuth-Callbacks
router.get('/callback', zoomController.handleZoomCallback);

// Route zum Erstellen eines Zoom-Meetings
router.post('/create-meeting', zoomController.createMeeting);

module.exports = router;
