const { verifyToken } = require('./jwtUtils');
const { pool } = require('../db/db');

// Helper สำหรับบันทึก log กรณี Token มีปัญหาลงใน task-db โดยตรง
async function logAuthError(req, message, error) {
  try {
    await pool.query(
      'INSERT INTO logs (level, event, user_id, message, meta) VALUES ($1, $2, $3, $4, $5)',
      [
        'ERROR', 
        'AUTH_FAILURE', 
        null, 
        message, 
        { 
          error: error,
          ip: req.headers['x-real-ip'] || req.ip,
          path: req.originalUrl
        }
      ]
    );
  } catch (err) {
    console.error('[TASK AUTH LOG ERROR]', err);
  }
}

module.exports = async function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // ถอดรหัส Token จะได้ payload: { sub, email, role, username }
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (err) {
    // เปลี่ยนจาก fetch ไปยัง log-service เป็นการบันทึกลง task-db ของตัวเอง
    await logAuthError(req, 'Invalid JWT token: ' + err.message, err.message);
    
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};