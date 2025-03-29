const Board = require("../models/Board");
const User = require("../models/User");

const createBoard = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user;

  try {
    const board = new Board({
      title,
      description,
      members: [{ userId, role: "admin" }],
    });
    await board.save();

    const user = await User.findById(userId);
    user.boards.push(board._id);
    await User.save();

    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//lấy ds bảng
const getBoards = async (req, res) => {
  const { userId } = req.user;
  try {
    const boards = await Board.find({ "members.userId": userId }).populate(
      "lists"
    );
    res.json({ boards });
  } catch (error) {
    console.error("Error fetching boards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//lấy một bảng
const getBoard = async (req, res) => {
  const { id } = res.params;
  try {
    const board = await Board.findById(id)
      .populate({
        path: "lists",
        populate: { path: "cards" },
      })
      .populate("members.userId");
    if (!board) {
      return res.status(400).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    console.error("Error fetching board :", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await Board.findById(id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    const isAdmin = board.members.some(
      (member) => member.userId.toString() === userId && member.role === "admin"
    );
    if (!isAdmin)
      return res
        .status(403)
        .json({ message: "Only admin can delete the board" });

    await Board.deleteOne({ _id: id });
    await User.updateMany({}, { $pull: { boards: id } });
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error fetching board :", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addMemberToBoard = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const board = await Board.findById(id);
    if (!board) return res.status(404).json({ message: "Board not found" });

    if (board.members.some((member) => member.userId.toString() === userId))
      return res.status(400).json({ message: "User already in board" });

    board.members.push({ userId, role: "member" });
    await board.save();

    const user = await User.findById(userId);
    user.boards.push(board._id);
    await user.save();

    res.json({ message: "Member added successfully", board });
  } catch (error) {
    console.error("Error adding member to board", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createBoard,
  getBoard,
  getBoards,
  deleteBoard,
  addMemberToBoard,
};
