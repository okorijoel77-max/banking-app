require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbService = require("./services/dbService");
const authRoutes = require("./routes/authRoutes");
const accountRoutes =
  require("./routes/accountRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.get("/", (req, res) => {
  res.json({
    app: "Bank App API",
    status: "running"
  });
});

(async () => {
  await dbService.initDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
