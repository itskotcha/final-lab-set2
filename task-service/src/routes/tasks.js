const express = require("express");
const pool = require("../db/db");
const { requireAuth } = require("../middleware/jwtUtils");

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

// ─── GET /api/tasks/health ─────────────────────────────────
router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", service: "task-service", db: "connected" });
  } catch (err) {
    return res.status(503).json({ status: "error", db: err.message });
  }
});

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.sub],
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("[GET /tasks]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/tasks/:id ──────────────────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.sub],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[GET /tasks/:id]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /api/tasks ─────────────────────────────────────────────────────────
router.post("/", requireAuth, async (req, res) => {
  const { title, description, status = "TODO", priority = "medium" } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title จำเป็นต้องกรอก" });
  }

  const validStatus = ["TODO", "IN_PROGRESS", "DONE"];
  const validPriority = ["low", "medium", "high"];

  if (!validStatus.includes(status)) {
    return res
      .status(400)
      .json({ error: `status ต้องเป็น: ${validStatus.join(", ")}` });
  }
  if (!validPriority.includes(priority)) {
    return res
      .status(400)
      .json({ error: `priority ต้องเป็น: ${validPriority.join(", ")}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.sub, title, description || null, status, priority],
    );
    const task = result.rows[0];
    await writeLog(
      "info",
      "task_created",
      req.user.sub,
      `Task created: ${title}`,
      { task_id: task.id },
    );
    return res.status(201).json(task);
  } catch (err) {
    console.error("[POST /tasks]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── PUT /api/tasks/:id ──────────────────────────────────────────────────────
router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, status, priority } = req.body;

  try {
    // ตรวจสอบว่า task นี้เป็นของ user คนนี้
    const existing = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.sub],
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE tasks
       SET title       = $1,
           description = $2,
           status      = $3,
           priority    = $4,
           updated_at  = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        title ?? current.title,
        description ?? current.description,
        status ?? current.status,
        priority ?? current.priority,
        req.params.id,
        req.user.sub,
      ],
    );
    await writeLog(
      "info",
      "task_updated",
      req.user.sub,
      `Task updated: ${req.params.id}`,
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[PUT /tasks/:id]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── DELETE /api/tasks/:id ───────────────────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [req.params.id, req.user.sub],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    await writeLog(
      "info",
      "task_deleted",
      req.user.sub,
      `Task deleted: ${req.params.id}`,
    );
    return res.json({ message: "ลบ task สำเร็จ", id: result.rows[0].id });
  } catch (err) {
    console.error("[DELETE /tasks/:id]", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;