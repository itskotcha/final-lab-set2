const { verifyToken } = require("./jwtUtils");

module.exports = function requireAuth(req, res, next) {
  const header = req.headers["authorization"] || "";

  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = verifyToken(token);

    // decoded = { sub, email, username, role }
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    // fire and forget logging
    if (typeof fetch !== "undefined") {
      fetch("http://log-service:3003/api/logs/internal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "task-service",
          level: "ERROR",
          event: "JWT_INVALID",
          message: "Invalid JWT token: " + err.message,
          meta: { error: err.message },
        }),
      }).catch(() => {});
    }

    return res.status(401).json({
      error: "Unauthorized: " + err.message,
    });
  }
};