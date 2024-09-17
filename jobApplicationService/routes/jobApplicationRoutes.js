// routes/jobApplicationRoutes.js

const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');
const auth = require('../middleware/auth'); // Deine Authentifizierungs-Middleware

// Routen für Bewerbungen (mit Authentifizierung)

// Konversationen eines Nutzers abrufen (nur für User)
router.get('/:jobId', auth(['user', 'recruiter']), jobApplicationController.getJobApplications); 

// Eine Bewerbung hinzufügen (nur für User)
router.post('/', auth(['user']), jobApplicationController.addJobApplication); 

// Den Status einer Bewerbung aktualisieren (nur für Recruiter)
router.put('/:id', auth(['recruiter']), jobApplicationController.updateApplicationStatus); 

module.exports = router;
