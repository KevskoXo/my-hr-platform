const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authenticateUser = require('../middleware/authenticateUser');

// Lebenslauf erstellen
router.post('/create', authenticateUser, resumeController.createResume);

// Lebenslauf anzeigen
router.get('/', authenticateUser, resumeController.getResume);

// Lebenslauf aktualisieren
router.put('/update', authenticateUser, resumeController.updateResume);

module.exports = router;
