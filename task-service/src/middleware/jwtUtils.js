const jwt = require('jsonwebtoken');

// ปรับ Secret ให้ตรงกับ dev-shared-secret ตามที่กำหนดใน docker-compose ของ Set 2
const SECRET = process.env.JWT_SECRET || 'dev-shared-secret';

/**
 * ใน Task Service จริงๆ แล้วส่วนใหญ่จะใช้แค่ verifyToken 
 * แต่การมี generateToken ไว้เผื่อใช้ในการทำ Unit Test ก็เป็นเรื่องที่ดีครับ
 */
function generateToken(payload) {
  // ใช้ JWT_EXPIRES_IN เพื่อให้สอดคล้องกับค่าที่ตั้งไว้ใน Railway/Docker
  const expires = process.env.JWT_EXPIRES_IN || '1h';
  return jwt.sign(payload, SECRET, { expiresIn: expires });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };