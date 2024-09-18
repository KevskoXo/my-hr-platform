// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (requiredRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        try {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Überprüfen, ob die Rolle zugelassen ist
            if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
            }

            next();
            
        } catch (err) {
            res.status(401).json({ error: 'Token is not valid' });
        }
    };
};

module.exports = auth;
