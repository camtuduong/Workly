const Board = require("../models/Board");
const mongoose = require("mongoose");

let io;
const setIo = (socketIo) => {
  io = socketIo;
};

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    console.log("req.user:", req.user); // Log để kiểm tra
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const board = new Board({ title, createdBy: userId });
    await board.save();

    console.log("Emitting boardCreated event:", board);
    io.emit("boardCreated", board);

    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllBoards = async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await Board.find({ createdBy: userId }); // Chỉ lấy boards của user hiện tại
    res.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({ _id: id, createdBy: userId }).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    res.json(board);
  } catch (error) {
    console.error("Error fetching board:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const board = await Board.findOne({ _id: id, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    board.title = title;
    await board.save();

    io.to(id).emit("boardUpdated", board);
    io.emit("boardUpdated", board);

    res.json(board);
  } catch (error) {
    console.error("Error updating board:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findOne({ _id: id, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    await board.deleteOne();

    // Kiểm tra io trước khi emit
    if (io) {
      io.emit("boardDeleted", id);
    } else {
      console.warn("Socket.IO instance (io) is not initialized");
    }

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  setIo,
  createBoard,
  getAllBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};
