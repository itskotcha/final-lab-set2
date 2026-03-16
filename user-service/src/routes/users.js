const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {

  const userId = req.user.sub;

  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE user_id=$1",
    [userId]
  );

  res.json(result.rows[0]);
});

module.exports = router;