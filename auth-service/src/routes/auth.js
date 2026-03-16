const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');

const router = express.Router();

// bcrypt hash ที่ valid จริง ใช้สำหรับ timing-safe compare กรณีไม่พบ user
const DUMMY_BCRYPT_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8y0R6VQwWi4KFOeFHrgb3R04QLbL7a';

// ── Helper: บันทึก log ลง auth-db โดยตรง (Set 2) ────────────────────────────────
async function logEvent({ level, event, userId, message, meta = {} }) {
  try {
    await pool.query(
      'INSERT INTO logs (level, event, user_id, message, meta) VALUES ($1, $2, $3, $4, $5)',
      [level, event, userId, message, meta]
    );
  } catch (err) {
    console.error('[LOG ERROR]', err);
  }
}

// ─────────────────────────────────────────────
// POST /api/auth/register (เพิ่มตามข้อกำหนด Set 2)
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน (username, email, password)' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    // 1. ตรวจสอบว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2', 
      [normalizedEmail, username]
    );
    
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email หรือ Username นี้มีในระบบแล้ว' });
    }

    // 2. แฮชรหัสผ่านและบันทึกผู้ใช้ใหม่
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, normalizedEmail, passwordHash, 'member']
    );

    const newUser = result.rows[0];

    // 3. บันทึก Log ลง auth-db ทันทีผ่านฟังก์ชัน Helper
    await logEvent({
      level: 'INFO',
      event: 'REGISTER_SUCCESS',
      userId: newUser.id,
      message: `User ${newUser.username} registered successfully`,
      meta: { email: newUser.email, ip }
    });

    res.status(201).json(newUser);

  } catch (err) {
    console.error('[AUTH] Register error:', err.message);

    await logEvent({
      level: 'ERROR',
      event: 'REGISTER_ERROR',
      userId: null,
      message: err.message,
      meta: { email: normalizedEmail, ip }
    });

    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!email || !password) {
    return res.status(400).json({ error: 'กรุณากรอก email และ password' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
      [normalizedEmail]
    );

    const user = result.rows[0] || null;

    // Timing attack prevention
    const passwordHash = user ? user.password_hash : DUMMY_BCRYPT_HASH;
    const isValid = await bcrypt.compare(password, passwordHash);

    if (!user || !isValid) {
      await logEvent({
        level: 'WARN',
        event: 'LOGIN_FAILED',
        userId: user?.id || null,
        message: `Login failed for: ${normalizedEmail}`,
        meta: { email: normalizedEmail, ip }
      });

      return res.status(401).json({ error: 'Email หรือ Password ไม่ถูกต้อง' });
    }

    // อัปเดต last_login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // สร้าง JWT โดยใช้ sub อ้างอิง id ผู้ใช้ตามข้อกำหนด Set 2
    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    });

    await logEvent({
      level: 'INFO',
      event: 'LOGIN_SUCCESS',
      userId: user.id,
      message: `User ${user.username} logged in`,
      meta: { username: user.username, role: user.role, ip }
    });

    res.json({
      message: 'Login สำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('[AUTH] Login error:', err.message);

    await logEvent({
      level: 'ERROR',
      event: 'LOGIN_ERROR',
      userId: null,
      message: err.message,
      meta: { email: normalizedEmail, ip }
    });

    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/verify
// ─────────────────────────────────────────────
router.get('/verify', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ valid: false, error: 'No token' });

  try {
    const decoded = verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/me (ต้องมี JWT)
// ─────────────────────────────────────────────
router.get('/me', async (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = verifyToken(token);
    const result = await pool.query(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1',
      [decoded.sub]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/health
// ─────────────────────────────────────────────
router.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'auth-service',
    time: new Date()
  });
});

module.exports = router;