// recruiterService/routes/recruiterRoutes.js

const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Route zum Erstellen eines Recruiters (öffentlich)
router.post('/register', recruiterController.registerRecruiter);

// Route zum Login (öffentlich)
router.post('/login', recruiterController.loginRecruiter);

// Route zum Abrufen eines Recruiters nach ID (öffentlich)
router.get('/:id', recruiterController.getRecruiterById);

// Route zum Verknüpfen eines Recruiters mit einem Unternehmen (nur für Recruiter)
router.post('/assign-company', auth(['recruiter']), recruiterController.assignCompanyToRecruiter);

// Geschützte Route, nur zugänglich mit gültigem Token (nur für Recruiter)
router.get('/profile', auth(['recruiter']), recruiterController.getRecruiterProfile);

// Refresh Token Route (öffentlich)
router.post('/refresh-token', recruiterController.refreshToken);

// Logout Route (geschützt)
router.post('/logout', auth(['recruiter']), recruiterController.logout);

module.exports = router;
