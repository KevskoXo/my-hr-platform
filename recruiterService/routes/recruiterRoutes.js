const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const auth = require('../middleware/auth');

// Route zum Erstellen eines Recruiters
router.post('/register', recruiterController.registerRecruiter);

//route zum login
router.post('/login', recruiterController.loginRecruiter);

// Route zum Abrufen eines Recruiters nach ID
router.get('/:id', recruiterController.getRecruiterById);

// Route zum Verknüpfen eines Recruiters mit einem Unternehmen
router.post('/assign-company', recruiterController.assignCompanyToRecruiter);

// Geschützte Route, nur zugänglich mit gültigem Token
router.get('/profile', auth, recruiterController.getRecruiterProfile);

module.exports = router;
