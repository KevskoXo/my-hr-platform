const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');
// Registrierung
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Geschützte Route für User Profil
router.get('/profile', authMiddleware, userController.getUserProfile);

// Lebenslauf erstellen
router.post('/resume/create', authMiddleware, async (req, res) => {
    try {
        const response = await axios.post(`http://localhost:${process.env.PORT_RESUME}/resume/create`, req.body, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

// Lebenslauf anzeigen
router.get('/resume', authMiddleware, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:${process.env.PORT_RESUME}/resume`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
