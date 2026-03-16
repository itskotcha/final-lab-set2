const jwt = require('jsonwebtoken');

// ปรับให้ตรงกับ Environment Variables ที่กำหนดในโจทย์ Set 2
const SECRET  = process.env.JWT_SECRET || 'dev-shared-secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };