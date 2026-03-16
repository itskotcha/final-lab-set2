CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'member',
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);