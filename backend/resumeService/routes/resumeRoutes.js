// resumeService/routes/resumeRoutes.js

const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Lebenslauf erstellen (nur für User)
router.post('/create', auth(['user']), resumeController.createResume);

// Lebenslauf anzeigen (nur für User)
router.get('/', auth(['user']), resumeController.getResume);

// Lebenslauf aktualisieren (nur für User)
router.put('/update', auth(['user']), resumeController.updateResume);

module.exports = router;
