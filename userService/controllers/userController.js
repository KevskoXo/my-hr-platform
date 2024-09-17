const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtils');

// User Registrierung
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Überprüfen, ob der User bereits existiert
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen User erstellen
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        //JWT-Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
 
        user.refreshToken = refreshToken;

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' , accessToken, refreshToken});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User in der Datenbank suchen
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Passwort überprüfen
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // JWT-Token plus refreshToken erstellen 
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Profil (geschützte Route)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User nach ID abrufen
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);//.populate('company').populate('jobs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Token-refresh
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No token provided' });

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err || user._id.toString() !== decoded.userId) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

//user logout
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.refreshToken = null;
        await user.save();
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
