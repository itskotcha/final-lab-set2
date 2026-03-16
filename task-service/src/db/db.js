const { Pool } = require("pg");

const pool = new Pool({
  // ใช้ DATABASE_URL เป็นหลักเพื่อให้รองรับ Railway และ Docker Compose ของ Set 2
  // Fallback ไปที่พอร์ต 5434 ซึ่งเป็นพอร์ตของ task-db ที่ตั้งไว้ใน docker-compose.yml
  connectionString: process.env.DATABASE_URL || "postgres://admin:secret@localhost:5434/taskdb",
});

module.exports = { pool };