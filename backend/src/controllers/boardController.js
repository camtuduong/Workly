const Board = require("../models/Board");
const User = require("../models/User");
const mongoose = require("mongoose");

let io;
const setIo = (socketIo) => {
  io = socketIo;
};

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Vui lòng nhập Title" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Không tìm thấy User ID trong token" });
    }

    const board = new Board({
      title,
      createdBy: userId,
      members: [{ userId: userId, role: "admin" }],
    });

    await board.save();

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

    const boards = await Board.find({ "members.userId": userId })
      .select("title members createdBy")
      .sort({ createdAt: -1 });

    const boardsWithRole = boards.map((board) => {
      const member = board.members.find((m) => m.userId.toString() === userId);

      return {
        _id: board._id,
        title: board.title,
        createdBy: board.createdBy,
        role: member?.role || "",
      };
    });

    res.json(boardsWithRole);
  } catch (error) {
    console.error("Error fetching boards:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOne({
      _id: id,
      "members.userId": userId,
    }).populate({
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

//member
const getBoardMembers = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const members = await Promise.all(
      board.members.map(async (member) => {
        const user = await User.findById(member.userId);
        return {
          userId: member.userId,
          role: member.role,
          username: user?.username || "Unknown",
          email: user?.email || "Unknown",
        };
      })
    );

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { memberId, role } = req.body;
    const userId = req.user.id;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isAdmin = board.members.some(
      (member) => member.userId.toString() === userId && member.role === "admin"
    );
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to add members" });
    }

    const existingMember = board.members.find(
      (member) => member.userId.toString() === memberId
    );
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "Member already exists in the board" });
    }

    board.members.push({ userId: memberId, role: role || "member" });
    await board.save();

    const member = await User.findById(memberId);
    if (!member) return res.status(404).json({ message: "User not found" });

    member.boards.push({ boardId: board._id, role: role || "member" });
    await member.save();

    io.to(boardId).emit("membersChanged");

    res.status(200).json({ message: "Member added successfully", board });
  } catch (error) {
    console.error("Error adding member:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { boardId, memberId } = req.params;
    const userId = req.user.id;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isAdmin = board.members.some(
      (member) => member.userId.toString() === userId && member.role === "admin"
    );
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to remove members" });
    }

    const memberToRemove = board.members.find(
      (member) => member.userId.toString() === memberId
    );
    if (!memberToRemove) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (memberToRemove.role === "admin" && userId !== memberId) {
      return res
        .status(400)
        .json({ message: "You cannot remove another admin" });
    }

    if (userId === memberId) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    board.members = board.members.filter(
      (member) => member.userId.toString() !== memberId
    );
    await board.save();

    io.to(boardId).emit("membersChanged");

    res.status(200).json({ message: "Member removed successfully", board });
  } catch (error) {
    console.error("Error removing member:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { boardId, memberId } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "member", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isAdmin = board.members.some(
      (member) =>
        member.userId.toString() === req.user.id && member.role === "admin"
    );
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update member roles" });
    }

    const member = board.members.find(
      (member) => member.userId.toString() === memberId
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.role = role;
    await board.save();

    io.to(boardId).emit("membersChanged");

    res.status(200).json({ message: "Role updated successfully", board });
  } catch (error) {
    console.error("Error updating member role:", error.message);
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
  getBoardMembers,
  addMember,
  removeMember,
  updateMemberRole,
};
