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

-- เพิ่มข้อมูล Seed Users ด้วย Hash จริงที่คุณสร้างมา
INSERT INTO users (username, email, password_hash, role) VALUES 
('alice', 'alice@lab.local', '$2a$10$KGY9/BHZiSzS37tFbEWnMeCT1hrP2GlnX52iM0R6mPbwV6J0SV/nq', 'member'),
('bob', 'bob@lab.local', '$2a$10$BYDW9y7twKJAAvu.sy7Okun9.NzqaSZ2QDy0hNrbHLiA5LwQxTI6m', 'member'),
('admin', 'admin@lab.local', '$2a$10$vwiTlJo8pCVfIEHZfkGdI.jf9RsC1YNM61sAWGpyu.I1oyoD/Ije.', 'admin');