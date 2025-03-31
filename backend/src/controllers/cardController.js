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

    const card = new Card({ title, listId });
    await card.save();

    list.cards.push(card._id);
    await list.save();

    const updatedBoard = await Board.findById(list.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(board._id).emit("boardUpdated", updatedBoard);

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

    await card.remove();

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
    const { cardId, newListId, newPosition } = req.body;
    const userId = req.user.id;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const oldList = await List.findById(card.listId);
    const newList = await List.findById(newListId);

    if (!oldList || !newList) {
      return res.status(404).json({ message: "List not found" });
    }

    const board = await Board.findOne({
      _id: newList.boardId,
      createdBy: userId,
    });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    oldList.cards = oldList.cards.filter((id) => id.toString() !== cardId);
    await oldList.save();

    newList.cards.splice(newPosition, 0, cardId);
    await newList.save();

    card.listId = newListId;
    await card.save();

    const updatedBoard = await Board.findById(newList.boardId).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(board._id).emit("boardUpdated", updatedBoard);

    res.json({ message: "Card position updated successfully" });
  } catch (error) {
    console.error("Error updating card position:", error.message);
    res.status(500).json({ message: "Server Error" });
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
