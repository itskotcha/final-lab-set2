const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const { username, email, role } = req.user; // ดึงข้อมูลจาก JWT Payload

  try {
    // 1. พยายามดึงข้อมูลโปรไฟล์
    const result = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id=$1",
      [userId]
    );

    // 2. Logic การสร้างโปรไฟล์อัตโนมัติ (Requirement Set 2)
    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO user_profiles (user_id, username, email, role, display_name) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, username, email, role, username]
      );
      return res.json(insertResult.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;