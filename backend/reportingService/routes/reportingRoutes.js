// routes/reportingRoutes.js

const express = require('express');
const router = express.Router();
const recruiterPerformanceController = require('../controllers/recruiterPerformanceController');
const jobApplicationController = require('../controllers/jobApplicationController');
const diversityMetricsController = require('../controllers/diversityMetricsController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Routen für RecruiterPerformance (nur für Recruiter)
router.get('/recruiter/:recruiterId', auth(['recruiter']), recruiterPerformanceController.getRecruiterPerformance);
router.post('/recruiter', auth(['recruiter']), recruiterPerformanceController.addRecruiterPerformance);

// Routen für JobApplication (nur für Recruiter)
router.get('/applications/:jobId', auth(['recruiter']), jobApplicationController.getJobApplications);
router.post('/applications', auth(['recruiter']), jobApplicationController.addJobApplication);
router.put('/applications/:id', auth(['recruiter']), jobApplicationController.updateApplicationStatus);

// Routen für DiversityMetrics (nur für Recruiter)
router.get('/diversity/:jobId', auth(['recruiter']), diversityMetricsController.getDiversityMetrics);
router.post('/diversity', auth(['recruiter']), diversityMetricsController.addDiversityMetrics);

module.exports = router;
