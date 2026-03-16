const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ ใช้ CORS middleware
app.use(cors(corsOptions));

// ✅ จัดการ preflight OPTIONS request โดยตรง
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ service: "auth-service", status: "ok", port: PORT });
});

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query("SELECT 1");
      console.log("[auth-service] ✅ Connected to auth-db");
      break;
    } catch (err) {
      retries--;
      console.warn(
        `[auth-service] DB not ready, retrying... (${retries} left)`,
      );
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (retries === 0) {
    console.error("[auth-service] ❌ Cannot connect to DB. Exiting.");
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[auth-service] 🚀 Running on port ${PORT}`);
  });
}

start();