// authenticationService/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

router.post('/login', authenticationController.login);
router.post('/refresh-token', authenticationController.refreshToken);
router.post('/logout', authenticationController.logout);

module.exports = router;
