// jobService/routes/jobRoutes.js

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateRecruiter } = require ('../middleware/auth.js')

router.get('/', jobController.getAllJobs);
router.post('/', jobController.createJob);
router.get('/:id', jobController.getJobById);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.post('/create', authenticateRecruiter, jobController.createJob);
router.get('/search', jobController.searchJobs);

module.exports = router;
