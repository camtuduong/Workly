const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
dotenv.config();

// Middleware
// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Đảm bảo CORS cho frontend
app.use(express.json()); // Parse JSON

// Routes
app.use("/api/users", userRoutes);

// Kết nối MongoDB
connectDB();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
