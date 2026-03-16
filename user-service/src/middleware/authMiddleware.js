const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // ตรวจสอบว่ามี Header และขึ้นต้นด้วย Bearer หรือไม่
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ใช้ Secret จาก Environment ที่ตั้งไว้ใน docker-compose (dev-shared-secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // เก็บข้อมูล user ไว้ใน request เพื่อให้ route อื่นๆ ใช้งานต่อได้
    req.user = decoded; 
    next();
  } catch (err) {
    // ตอบกลับตามประเภทความผิดพลาดของ Token เช่น Expired หรือ Invalid
    res.status(401).json({ error: "Unauthorized: " + err.message });
  }
}

module.exports = authMiddleware;