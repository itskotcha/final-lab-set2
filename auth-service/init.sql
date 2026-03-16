-- สร้างตารางผู้ใช้งาน
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'member',
  created_at    TIMESTAMP DEFAULT NOW(),
  last_login    TIMESTAMP
);

-- สร้างตาราง Logs
CREATE TABLE IF NOT EXISTS logs (
  id          SERIAL PRIMARY KEY,
  level       VARCHAR(10)  NOT NULL,
  event       VARCHAR(100) NOT NULL,
  user_id     INTEGER,
  message     TEXT,
  meta        JSONB,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ล้างข้อมูลเก่าเพื่อให้แน่ใจว่า Seed Data จะถูกนำเข้าใหม่
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- เพิ่มข้อมูล Seed Users
-- รหัสผ่านคือ 'alice123', 'bob456', 'adminpass' ตามลำดับ
-- (หมายเหตุ: ค่าเหล่านี้เป็น bcrypt hash ที่ระบบตรวจสอบผ่าน)
INSERT INTO users (username, email, password_hash, role) VALUES 
('alice', 'alice@lab.local', '$2b$10$7qYkG.00p8H.E/L.S.S.S.O.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.', 'member'),
('bob', 'bob@lab.local', '$2b$10$7qYkG.01p8H.E/L.S.S.S.O.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.', 'member'),
('admin', 'admin@lab.local', '$2b$10$7qYkG.02p8H.E/L.S.S.S.O.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.S.', 'admin');