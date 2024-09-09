// blocklistService/routes/blocklistRoutes.js

const express = require('express');
const router = express.Router();
const blocklistController = require('../controllers/blocklistController');
const authMiddleware = require('../middleware/authMiddleware');

// Blocklist eines Nutzers abrufen
router.get('/', authMiddleware, blocklistController.getBlocklist);

// Einen Recruiter zur Blockliste hinzufügen
router.post('/block/:recruiterId', authMiddleware, blocklistController.blockRecruiter);

// Einen Recruiter aus der Blockliste entfernen
router.delete('/unblock/:recruiterId', authMiddleware, blocklistController.unblockRecruiter);

module.exports = router;
