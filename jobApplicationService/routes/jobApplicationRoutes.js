// routes/jobApplicationRoutes.js
const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');
const auth = require('../middleware/auth'); // Deine Authentifizierungs-Middleware

// Routen für Bewerbungen (mit Authentifizierung)
router.get('/:jobId', auth, jobApplicationController.getJobApplications); 
router.post('/', auth, jobApplicationController.addJobApplication); 
router.put('/:id', auth, jobApplicationController.updateApplicationStatus); 

module.exports = router;
