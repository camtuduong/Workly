const List = require("../models/List");
const Board = require("../models/Board");

let io;
const setIo = (socketIo) => {
  io = socketIo;
};

const createList = async (req, res) => {
  try {
    const { boardId, title } = req.body;
    const userId = req.user.id;

    const board = await Board.findOne({ _id: boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    const list = new List({ title, boardId });
    await list.save();

    board.lists.push(list._id);
    await board.save();

    const updatedBoard = await Board.findById(boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(boardId).emit("boardUpdated", updatedBoard);

    res.status(201).json(list);
  } catch (error) {
    console.error("Error creating list:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    board.lists = board.lists.filter((listId) => listId.toString() !== id);
    await board.save();

    await list.remove();

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(list.boardId).emit("boardUpdated", updatedBoard);

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateListPosition = async (req, res) => {
  try {
    const { listId, newPosition } = req.body;
    const userId = req.user.id;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    board.lists.splice(board.lists.indexOf(listId), 1);
    board.lists.splice(newPosition, 0, listId);
    await board.save();

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(list.boardId).emit("boardUpdated", updatedBoard);

    res.json({ message: "List position updated successfully" });
  } catch (error) {
    console.error("Error updating list position:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { setIo, createList, deleteList, updateListPosition };
