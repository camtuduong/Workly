const Board = require("../models/Board");
const Card = require("../models/Card");
const User = require("../models/User");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lưu userId khi client kết nối (giả sử client gửi userId khi kết nối)
    socket.on("setUserId", (userId) => {
      socket.userId = userId;
      io.emit("userOnline", { userId });
      console.log(`User ${userId} is online`);
    });

    // Client tham gia một board
    socket.on("joinBoard", (boardId) => {
      socket.join(boardId);
      console.log(`User ${socket.id} joined board ${boardId}`);
    });

    // Client rời một board
    socket.on("leaveBoard", (boardId) => {
      socket.leave(boardId);
      console.log(`User ${socket.id} left board ${boardId}`);
    });

    // Client tham gia chi tiết một card
    socket.on("joinCard", (cardId) => {
      socket.join(`card-${cardId}`);
      console.log(`User ${socket.id} joined card ${cardId}`);
    });

    // Client rời chi tiết một card
    socket.on("leaveCard", (cardId) => {
      socket.leave(`card-${cardId}`);
      console.log(`User ${socket.id} left card ${cardId}`);
    });

    // Xử lý cập nhật board
    socket.on("updateBoard", async ({ boardId }) => {
      try {
        const board = await Board.findById(boardId).populate({
          path: "lists",
          populate: { path: "cards" },
        });

        if (!board) {
          console.error(`Board ${boardId} not found`);
          return;
        }

        io.to(boardId).emit("boardUpdated", board);
        console.log(`Board ${boardId} updated and broadcasted`);
      } catch (error) {
        console.error(`Error updating board ${boardId}:`, error.message);
      }
    });

    // Xử lý cập nhật card
    socket.on("updateCard", async ({ cardId }) => {
      try {
        const card = await Card.findById(cardId).populate("comments");
        if (!card) {
          console.error(`Card ${cardId} not found`);
          return;
        }

        io.to(`card-${cardId}`).emit("cardUpdated", card);
        console.log(`Card ${cardId} updated and broadcasted`);
      } catch (error) {
        console.error(`Error updating card ${cardId}:`, error.message);
      }
    });

    // Xử lý cập nhật user (nếu client yêu cầu)
    socket.on("updateUser", async ({ userId }) => {
      try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
          console.error(`User ${userId} not found`);
          return;
        }

        io.emit("userUpdated", {
          userId: user._id,
          username: user.username,
          email: user.email,
          language: user.language,
        });
        console.log(`User ${userId} updated and broadcasted`);
      } catch (error) {
        console.error(`Error updating user ${userId}:`, error.message);
      }
    });

    // Xử lý khi client ngắt kết nối
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      if (socket.userId) {
        io.emit("userOffline", { userId: socket.userId });
        console.log(`User ${socket.userId} is offline`);
      }
    });
  });
};

module.exports = setupSocket;
