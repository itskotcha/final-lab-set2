const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);

app.get("/api/users/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3003, () => {
  console.log("User Service running on port 3003");
});