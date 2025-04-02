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

    // Tính position: Lấy số lượng list hiện có trong board
    const listsInBoard = await List.find({ boardId });
    const position = listsInBoard.length;

    const list = new List({ title, boardId, position });
    await list.save();

    board.lists.push(list._id);
    await board.save();

    const updatedBoard = await Board.findById(boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!io) {
      console.error("Socket.IO not initialized");
    } else {
      io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
    }

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

    // Xóa list khỏi board
    board.lists = board.lists.filter((listId) => listId.toString() !== id);
    await board.save();

    // Xóa list
    await list.deleteOne();

    // Cập nhật position của các list còn lại
    const remainingLists = await List.find({ boardId: list.boardId }).sort({
      position: 1,
    });
    for (let i = 0; i < remainingLists.length; i++) {
      remainingLists[i].position = i;
      await remainingLists[i].save();
    }

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!io) {
      console.error("Socket.IO not initialized");
    } else {
      io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
    }

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//  updateListPosition
const updateListPosition = async (req, res) => {
  try {
    const { listId, newPosition } = req.body;
    const userId = req.user.id;

    // Kiểm tra dữ liệu đầu vào
    if (!listId || newPosition === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required fields: listId, newPosition" });
    }

    // Tìm list
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Tìm board chứa list
    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    // Kiểm tra newPosition hợp lệ
    if (newPosition < 0 || newPosition >= board.lists.length) {
      return res.status(400).json({ message: "Invalid newPosition" });
    }

    // Cập nhật vị trí list trong board
    const listIndex = board.lists.findIndex((id) => id.toString() === listId);
    if (listIndex === -1) {
      return res.status(404).json({ message: "List not found in board" });
    }

    // Di chuyển list đến vị trí mới
    board.lists.splice(listIndex, 1);
    board.lists.splice(newPosition, 0, listId);
    await board.save();

    // Cập nhật position của tất cả list
    const listsInBoard = await List.find({ boardId: list.boardId });
    for (let i = 0; i < board.lists.length; i++) {
      const currentList = listsInBoard.find(
        (l) => l._id.toString() === board.lists[i].toString()
      );
      if (currentList) {
        currentList.position = i;
        await currentList.save();
      }
    }

    // Cập nhật board và emit sự kiện
    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!io) {
      console.error("Socket.IO not initialized");
    } else {
      io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
    }

    res.json({ message: "List position updated successfully" });
  } catch (error) {
    console.error("Error updating list position:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  setIo,
  createList,
  deleteList,
  updateListPosition,
};
