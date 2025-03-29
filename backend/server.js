const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const boardRoutes = require("./src/routes/boardRoutes");
const listRoutes = require("./src/routes/listRoutes");
const cardRoutes = require("./src/routes/cardRoutes");

const app = express();
dotenv.config();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Đảm bảo CORS cho frontend
app.use(express.json()); // Parse JSON

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/lists", listRoutes);

// Kết nối MongoDB
connectDB();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
