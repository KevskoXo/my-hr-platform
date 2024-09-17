// jobService/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Routen für Jobs
router.get('/', jobController.getAllJobs); // Öffentlich zugänglich
router.post('/', auth(['recruiter']), jobController.createJob); // Nur Recruiter können Jobs erstellen
router.get('/:id', jobController.getJobById); // Öffentlich zugänglich
router.put('/:id', auth(['recruiter']), jobController.updateJob); // Nur Recruiter können Jobs aktualisieren
router.delete('/:id', auth(['recruiter']), jobController.deleteJob); // Nur Recruiter können Jobs löschen
router.get('/search', jobController.searchJobs); // Öffentlich zugänglich

module.exports = router;
