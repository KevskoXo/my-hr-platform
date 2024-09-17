// userService/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren
const axios = require('axios');

// Registrierung (öffentlich)
router.post('/register', userController.registerUser);

// Login (öffentlich)
router.post('/login', userController.loginUser);

// Geschützte Route für User-Profil
router.get('/profile', auth(['user']), userController.getUserProfile);

// User nach ID suchen (öffentlich)
router.get('/:id', userController.getUserById);

// Lebenslauf erstellen (nur für User)
router.post('/resume/create', auth(['user']), async (req, res) => {
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

// Lebenslauf anzeigen (nur für User)
router.get('/resume', auth(['user']), async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:${process.env.PORT_RESUME}/resume`, {
            headers: {
                Authorization: req.header('Authorization')
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
