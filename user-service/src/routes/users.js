const express = require("express");
const pool = require("../db/db");
const { requireAuth, requireAdmin } = require("../middleware/jwtUtils");

const router = express.Router();

// ─── helper: log to DB ───────────────────────────────────────────────────────
async function writeLog(level, event, userId, message, meta = {}) {
  try {
    await pool.query(
      `INSERT INTO logs (level, event, user_id, message, meta)
       VALUES ($1, $2, $3, $4, $5)`,
      [level, event, userId || null, message, JSON.stringify(meta)],
    );
  } catch (_) {}
}

// ─── helper: สร้าง profile เริ่มต้นจาก JWT payload ──────────────────────────
async function getOrCreateProfile(user) {
  // ลองดึง profile ก่อน
  const existing = await pool.query(
    `SELECT * FROM user_profiles WHERE user_id = $1`,
    [user.sub],
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // ยังไม่มี → สร้างใหม่อัตโนมัติจาก JWT
  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, username, email, role, display_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      user.sub,
      user.username || null,
      user.email || null,
      user.role || "member",
      user.username || null,
    ],
  );

  await writeLog(
    "info",
    "profile_auto_created",
    user.sub,
    `Auto-created profile for user_id: ${user.sub}`,
  );
  return result.rows[0];
}

// ─── GET /api/users/health ───────────────────────────────────────────────────
// ต้องอยู่ก่อน /:id เพื่อกัน routing conflict
router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", service: "user-service", db: "connected" });
  } catch (err) {
    return res.status(503).json({ status: "error", db: err.message });
  }
});

// ─── GET /api/users ──────────────────────────────────────────────────────────
// Admin only — ดูรายชื่อผู้ใช้ทั้งหมด
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, username, email, role, display_name, bio, avatar_url, updated_at
       FROM user_profiles
       ORDER BY user_id ASC`,
    );
    return res.json({ users: result.rows });
  } catch (err) {
    console.error("[GET /users]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/users/me ───────────────────────────────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user);
    return res.json({ profile });
  } catch (err) {
    console.error("[GET /users/me]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── PUT /api/users/me ───────────────────────────────────────────────────────
router.put("/me", requireAuth, async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;

  try {
    // ให้แน่ใจว่า profile มีอยู่ก่อน (auto-create ถ้าจำเป็น)
    await getOrCreateProfile(req.user);

    const result = await pool.query(
      `UPDATE user_profiles
       SET display_name = COALESCE($1, display_name),
           bio          = COALESCE($2, bio),
           avatar_url   = COALESCE($3, avatar_url),
           updated_at   = NOW()
       WHERE user_id = $4
       RETURNING *`,
      [display_name ?? null, bio ?? null, avatar_url ?? null, req.user.sub],
    );

    await writeLog(
      "info",
      "profile_updated",
      req.user.sub,
      `Profile updated for user_id: ${req.user.sub}`,
    );
    return res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error("[PUT /users/me]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;