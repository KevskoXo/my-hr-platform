const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Registrierung
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Geschützte Route für User Profil
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
