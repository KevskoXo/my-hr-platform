//ratingService/routes/ratingRoutes.js

const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

router.post('/submit', auth(['user', 'recruiter', 'admin', 'superAdmin']), ratingController.submitRating);
router.get('/company/:companyId', ratingController.getRatingsForCompany);
router.get('/job/:jobId', ratingController.getRatingsForJob);

module.exports = router;