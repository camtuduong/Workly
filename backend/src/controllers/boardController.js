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

//member
const getBoardMembers = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate(
      "members",
      "-password"
    );

    if (!board) return res.status(404).json({ message: "Board not found" });

    res.json(board.members);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addMember = async (req, res) => {
  const { boardId } = req.params;
  const { memberId, role } = req.body; // Role được truyền vào có thể là "member" hoặc "viewer"
  const userId = req.user.id;

  const board = await Board.findById(boardId);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  // Chỉ admin mới có quyền thêm thành viên
  const currentUser = await User.findById(userId);
  const isAdmin = board.members.some(
    (member) => member.userId.toString() === userId && member.role === "admin"
  );

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not authorized to add members" });
  }

  // Kiểm tra nếu thành viên đã có trong board
  const existingMember = board.members.find(
    (member) => member.userId.toString() === memberId
  );

  if (existingMember) {
    return res
      .status(400)
      .json({ message: "Member already exists in the board" });
  }

  // Thêm thành viên với role mặc định là "member"
  board.members.push({ userId: memberId, role: role || "member" });
  await board.save();

  res.status(200).json({ message: "Member added successfully", board });
};

const removeMember = async (req, res) => {
  const { boardId, memberId } = req.params;
  const userId = req.user.id;

  // Lấy thông tin board
  const board = await Board.findById(boardId);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  // Kiểm tra nếu người thực hiện có quyền admin
  const isAdmin = board.members.some(
    (member) => member.userId.toString() === userId && member.role === "admin"
  );

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not authorized to remove members" });
  }

  // Kiểm tra nếu người bị xóa là admin
  const memberToRemove = board.members.find(
    (member) => member.userId.toString() === memberId
  );

  if (!memberToRemove) {
    return res.status(404).json({ message: "Member not found" });
  }

  // Nếu người bị xóa là admin, và không phải chính mình thì không thể xóa
  if (memberToRemove.role === "admin" && userId !== memberId) {
    return res.status(400).json({ message: "You cannot remove another admin" });
  }

  // Nếu người muốn xóa chính mình thì cũng không được phép
  if (userId === memberId) {
    return res.status(400).json({ message: "You cannot remove yourself" });
  }

  // Tiến hành xóa thành viên khỏi board
  board.members = board.members.filter(
    (member) => member.userId.toString() !== memberId
  );

  await board.save();

  res.status(200).json({ message: "Member removed successfully", board });
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
};
