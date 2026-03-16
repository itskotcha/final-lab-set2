const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.json({ service: "task-service", status: "ok", port: PORT });
});

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query("SELECT 1");
      console.log("[task-service] ✅ Connected to task-db");
      break;
    } catch (err) {
      retries--;
      console.warn(
        `[task-service] DB not ready, retrying... (${retries} left)`,
      );
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (retries === 0) {
    console.error("[task-service] ❌ Cannot connect to DB. Exiting.");
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[task-service] 🚀 Running on port ${PORT}`);
  });
}

start();