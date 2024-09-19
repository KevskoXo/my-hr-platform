// authenticationService/utils/tokenUtils.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (userData) => {
  return jwt.sign(
    {
      userId: userData.userId,
      role: userData.role,
      name: userData.name,
      email: userData.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const generateRefreshToken = (userData) => {
  return jwt.sign(
    {
      userId: userData.userId,
      role: userData.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
