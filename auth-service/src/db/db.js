const { Pool } = require("pg");

const pool = new Pool({
  // ใช้ DATABASE_URL เป็นหลักตามข้อกำหนดของ Set 2 (Railway & Docker)
  connectionString: process.env.DATABASE_URL || "postgres://admin:secret@localhost:5433/authdb",
});

module.exports = { pool };