CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'TODO',
  priority    VARCHAR(10) DEFAULT 'medium',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  level      VARCHAR(10)  NOT NULL,
  event      VARCHAR(100) NOT NULL,
  user_id    INTEGER,
  message    TEXT,
  meta       JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data: Task Management System
INSERT INTO tasks (user_id, title, description, status, priority) VALUES
  -- Sprint Plan: Frontend & UX
  (1, 'Implement Dark Mode UI', 'Add Tailwind CSS config for dark/light theme toggle', 'TODO', 'medium'),
  (1, 'Optimize Image Assets', 'Convert PNGs to WebP and set up lazy loading', 'DONE', 'low'),
  
  -- Backend & Infrastructure
  (1, 'Refactor Database Indexing', 'Optimize queries for tasks table and user search', 'IN_PROGRESS', 'high'),
  (1, 'Setup Redis Caching', 'Cache user profile data to reduce DB load', 'TODO', 'high'),
  (1, 'Webhook Integration', 'Integrate Slack notifications for task status changes', 'IN_PROGRESS', 'medium'),

  -- DevOps & Security
  (2, 'Vulnerability Scanning', 'Run npm audit and update vulnerable dependencies', 'DONE', 'high'),
  (2, 'Configure CI/CD Pipeline', 'Setup GitHub Actions for auto-deploy to staging', 'IN_PROGRESS', 'high'),
  (2, 'SSL Certificate Renewal', 'Automate Let\'s Encrypt via Certbot', 'DONE', 'medium'),
  
  -- Documentation & Research
  (2, 'API Documentation (Swagger)', 'Generate OpenAPI spec from JSDoc comments', 'TODO', 'medium'),
  (2, 'User Feedback Analysis', 'Review survey results for the next sprint features', 'TODO', 'low');