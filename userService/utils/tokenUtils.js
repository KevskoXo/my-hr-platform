// utils/tokenUtils.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Access Token mit kurzer Gültigkeit
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Refresh Token mit längerer Gültigkeit
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
