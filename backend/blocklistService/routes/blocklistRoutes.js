// blocklistService/routes/blocklistRoutes.js

const express = require('express');
const router = express.Router();
const blocklistController = require('../controllers/blocklistController');
const authMiddleware = require('../middleware/auth');

// Blocklist eines Nutzers abrufen (nur für User)
router.get('/', authMiddleware(['user']), blocklistController.getBlockedRecruiters);

// Einen Recruiter zur Blockliste hinzufügen (nur für User)
router.post('/block/:recruiterId', authMiddleware(['user']), blocklistController.blockRecruiter);

// Einen Recruiter aus der Blockliste entfernen (nur für User)
router.delete('/unblock/:recruiterId', authMiddleware(['user']), blocklistController.unblockRecruiter);

module.exports = router;
