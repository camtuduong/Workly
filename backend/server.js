const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const setupSocket = require("./src/socket/socket");

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const boardRoutes = require("./src/routes/boardRoutes");
const listRoutes = require("./src/routes/listRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const cardController = require("./src/controllers/cardController");
const listController = require("./src/controllers/listController");
const boardController = require("./src/controllers/boardController");
const userController = require("./src/controllers/userController");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Đảm bảo CORS cho frontend
app.use(express.json()); // Parse JSON

// Setup Socket.IO
setupSocket(io);
cardController.setIo(io);
boardController.setIo(io);
listController.setIo(io);
userController.setIo(io);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/lists", listRoutes);

// Kết nối MongoDB
connectDB();

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
