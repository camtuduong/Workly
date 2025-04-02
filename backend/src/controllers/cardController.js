const mongoose = require("mongoose");
const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");

let io;
const setIo = (socketIo) => {
  io = socketIo;
};
const getCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const list = await List.findById(card.listId);
    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    // Thêm boardId vào card để sử dụng khi điều hướng
    card.boardId = list.boardId;

    res.json(card);
  } catch (error) {
    console.error("Error fetching card:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const createCard = async (req, res) => {
  try {
    const { listId, title } = req.body;
    const userId = req.user.id; // Lấy userId từ token (qua authMiddleware)

    // Kiểm tra listId
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Kiểm tra quyền truy cập board
    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    // Tính toán position: Lấy số lượng card hiện có trong list và đặt position mới
    const cardsInList = await Card.find({ listId });
    const position = cardsInList.length; // Vị trí mới sẽ là số lượng card hiện tại

    // Tạo card mới với createdBy và position
    const card = new Card({
      title,
      listId,
      createdBy: userId, // Gán createdBy từ userId
      position, // Gán position tự động
    });
    await card.save();

    // Thêm card vào list
    list.cards.push(card._id);
    await list.save();

    // Cập nhật board và emit sự kiện
    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!io) {
      console.error("Socket.IO not initialized");
    } else {
      io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
      console.log("Emitted boardUpdated for board:", board._id.toString());
    }

    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating card:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid card ID" });
    }

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const list = await List.findById(card.listId);
    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    card.title = title;
    await card.save();

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(board._id).emit("boardUpdated", updatedBoard);

    res.json(card);
  } catch (error) {
    console.error("Error updating card:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const list = await List.findById(card.listId);
    const board = await Board.findOne({ _id: list.boardId, createdBy: userId });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    list.cards = list.cards.filter((cardId) => cardId.toString() !== id);
    await list.save();

    await card.deleteOne();

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(board._id).emit("boardUpdated", updatedBoard);

    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCardPosition = async (req, res) => {
  try {
    const { cardId, newPosition, newListId } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const oldListId = card.listId;

    if (newListId && newListId !== oldListId) {
      // Di chuyển card sang list mới
      card.listId = newListId;
      await card.save();

      // Xóa card khỏi list cũ
      await List.findByIdAndUpdate(oldListId, {
        $pull: { cards: cardId },
      });

      // Thêm card vào list mới tại vị trí newPosition
      const newList = await List.findById(newListId);
      newList.cards.splice(newPosition, 0, cardId);
      await newList.save();

      // Cập nhật board
      const board = await Board.findOne({ lists: newListId });
      board.lists = board.lists.map((listId) =>
        listId.toString() === newListId ? newList : listId
      );
      await board.save();

      // Emit sự kiện boardUpdated
      req.io.emit("boardUpdated", board);
    } else {
      // Cập nhật vị trí card trong cùng list
      const list = await List.findById(card.listId);
      list.cards.splice(list.cards.indexOf(cardId), 1);
      list.cards.splice(newPosition, 0, cardId);
      await list.save();

      // Cập nhật board
      const board = await Board.findOne({ lists: list._id });
      board.lists = board.lists.map((listId) =>
        listId.toString() === list._id ? list : listId
      );
      await board.save();

      // Emit sự kiện boardUpdated
      req.io.emit("boardUpdated", board);
    }

    res.status(200).json({ message: "Card position updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setIo,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  updateCardPosition,
};
