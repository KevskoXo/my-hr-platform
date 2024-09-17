// utils/tokenUtils.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (recruiter) => {
  return jwt.sign(
    { recruiterId: recruiter._id, role: recruiter.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Access Token mit kurzer Gültigkeit
  );
};

const generateRefreshToken = (recruiter) => {
  return jwt.sign(
    { recruiterId: recruiter._id, role: recruiter.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Refresh Token mit längerer Gültigkeit
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
