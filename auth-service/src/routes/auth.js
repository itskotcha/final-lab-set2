const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db/db");
const { signToken, requireAuth } = require("../middleware/jwtUtils");

const router = express.Router();

// ─── helper: log to DB ──────────────────────────────────────────────────────
async function writeLog(level, event, userId, message, meta = {}) {
  try {
    await pool.query(
      `INSERT INTO logs (level, event, user_id, message, meta)
       VALUES ($1, $2, $3, $4, $5)`,
      [level, event, userId || null, message, JSON.stringify(meta)],
    );
  } catch (_) {
    /* ไม่ให้ log error ขัด flow หลัก */
  }
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email และ password จำเป็นต้องกรอก" });
  }

  try {
    // ตรวจสอบ email ซ้ำ
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "email หรือ username นี้มีอยู่แล้ว" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'member')
       RETURNING id, username, email, role, created_at`,
      [username, email, password_hash],
    );

    const user = result.rows[0];
    await writeLog(
      "info",
      "register",
      user.id,
      `New user registered: ${email}`,
    );

    return res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[register]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email และ password จำเป็นต้องกรอก" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "email หรือ password ไม่ถูกต้อง" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      await writeLog(
        "warn",
        "login_failed",
        user.id,
        `Failed login attempt: ${email}`,
      );
      return res.status(401).json({ error: "email หรือ password ไม่ถูกต้อง" });
    }

    // อัปเดต last_login
    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    const token = signToken({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    await writeLog("info", "login", user.id, `User logged in: ${email}`);

    return res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[login]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1",
      [req.user.sub],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("[me]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/auth/verify ────────────────────────────────────────────────────
// ใช้สำหรับ service อื่นตรวจสอบ token (optional internal use)
router.get("/verify", requireAuth, (req, res) => {
  return res.json({ valid: true, user: req.user });
});

// ─── GET /api/auth/health ────────────────────────────────────────────────────
router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", service: "auth-service", db: "connected" });
  } catch (err) {
    return res.status(503).json({ status: "error", db: err.message });
  }
});

module.exports = router;