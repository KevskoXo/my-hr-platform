// routes/reportingRoutes.js
const express = require('express');
const router = express.Router();
const recruiterPerformanceController = require('../controllers/recruiterPerformanceController');
const jobApplicationController = require('../controllers/jobApplicationController');
const diversityMetricsController = require('../controllers/diversityMetricsController');

// Routen für RecruiterPerformance
router.get('/recruiter/:recruiterId', recruiterPerformanceController.getRecruiterPerformance);
router.post('/recruiter', recruiterPerformanceController.addRecruiterPerformance);

// Routen für JobApplication
router.get('/applications/:jobId', jobApplicationController.getJobApplications);
router.post('/applications', jobApplicationController.addJobApplication);
router.put('/applications/:id', jobApplicationController.updateApplicationStatus);

// Routen für DiversityMetrics
router.get('/diversity/:jobId', diversityMetricsController.getDiversityMetrics);
router.post('/diversity', diversityMetricsController.addDiversityMetrics);

module.exports = router;
