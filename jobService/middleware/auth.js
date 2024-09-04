// middleware/auth.js

const jwt = require('jsonwebtoken');

exports.authenticateRecruiter = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = { recruiterId: decoded.recruiterId }; // Recruiter ID für spätere Verwendung
        next();
    });
};

