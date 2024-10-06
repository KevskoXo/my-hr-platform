// jobService/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Routen für Jobs
// GET /jobs/byCompany
router.get('/byCompany', auth(['superAdmin']), jobController.getJobsByCompany);

// GET /jobs/byAdmin
router.get('/byAdmin', auth(['admin']), jobController.getJobsByAdmin);

// GET /jobs/byRecruiter
router.get('/byRecruiter', auth(['recruiter']), jobController.getJobsByRecruiter);

// GET /jobs/byViewer
router.get('/byViewer', auth(['viewer']), jobController.getJobsByViewer);

// POST /jobs/:jobId/markAsViewed
router.post('/:jobId/markAsViewed', auth(['recruiter', 'superAdmin', 'admin']), jobController.markJobAsViewed);

// Update a job
router.put('/:jobId', auth(['recruiter', 'superAdmin', 'admin']), jobController.updateJob);

router.get('/', jobController.getAllJobs); // Öffentlich zugänglich
router.post('/', auth(['recruiter']), jobController.createJob); // Nur Recruiter können Jobs erstellen
router.get('/byCpmpany', auth(['recruiter', 'superAdmin', 'admin', 'viewer']), jobController.getJobsByCompany) // company jobs der recruiter
router.get('/:id', jobController.getJobById); // Öffentlich zugänglich
router.put('/:id', auth(['recruiter']), jobController.updateJob); // Nur Recruiter können Jobs aktualisieren
router.delete('/:id', auth(['recruiter']), jobController.deleteJob); // Nur Recruiter können Jobs löschen
router.get('/search', jobController.searchJobs); // Öffentlich zugänglich

module.exports = router;
