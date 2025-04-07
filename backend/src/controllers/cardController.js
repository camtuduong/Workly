const mongoose = require("mongoose");
const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const { hasBoardPermission } = require("../utils/permission");

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

    const board = await Board.findById(list.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (!hasBoardPermission(board, userId, ["admin", "member"])) {
      return res
        .status(403)
        .json({ message: "You don't have permission to add a list" });
    }

    const cardsInList = await Card.find({ listId });
    const position = cardsInList.length;

    const card = new Card({
      title,
      listId,
      createdBy: userId,
      position,
    });
    await card.save();

    list.cards.push(card._id);
    await list.save();

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
    const board = await Board.findById(list.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (
      card.assignedTo.toString() !== userId &&
      !hasBoardPermission(board, userId, ["admin"])
    ) {
      return res
        .status(403)
        .json({ message: "No permission to update this card" });
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

    const board = await Board.findById(list.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const member = board.members.find(
      (m) => m.userId.toString() === userId.toString()
    );
    if (!member || (member.role !== "admin" && member.role !== "member")) {
      return res
        .status(403)
        .json({ message: "You don't have permission to create a card" });
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
    const userId = req.user.id;

    if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid card ID" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const oldList = await List.findById(card.listId);
    if (!oldList) {
      return res.status(404).json({ message: "Old list not found" });
    }

    const board = await Board.findOne({
      _id: oldList.boardId,
      createdBy: userId,
    });
    if (!board) {
      return res
        .status(404)
        .json({ message: "Board not found or you don't have access" });
    }

    const oldListId = card.listId.toString();

    if (newListId && !mongoose.Types.ObjectId.isValid(newListId)) {
      return res.status(400).json({ message: "Invalid new list ID" });
    }

    if (newListId && newListId !== oldListId) {
      const newList = await List.findById(newListId);
      if (!newList) {
        return res.status(404).json({ message: "New list not found" });
      }

      const newListBoard = await Board.findOne({
        _id: newList.boardId,
        createdBy: userId,
      });
      if (!newListBoard) {
        return res.status(404).json({
          message: "New list's board not found or you don't have access",
        });
      }

      const oldListCardIndex = oldList.cards.indexOf(cardId);
      if (oldListCardIndex === -1) {
        return res
          .status(400)
          .json({ message: "Card not found in the old list" });
      }
      oldList.cards.splice(oldListCardIndex, 1);

      await Card.updateMany(
        { listId: oldListId, position: { $gt: card.position } },
        { $inc: { position: -1 } }
      );

      card.listId = newListId;
      card.position = newPosition;
      await card.save();

      await Card.updateMany(
        { listId: newListId, position: { $gte: newPosition } },
        { $inc: { position: 1 } }
      );

      newList.cards.splice(newPosition, 0, cardId);
      await newList.save();

      await oldList.save();
    } else {
      const list = await List.findById(card.listId);

      const cardIndex = list.cards.indexOf(cardId);
      if (cardIndex === -1) {
        return res.status(400).json({ message: "Card not found in the list" });
      }

      list.cards.splice(cardIndex, 1);

      if (card.position < newPosition) {
        await Card.updateMany(
          {
            listId: card.listId,
            position: { $gt: card.position, $lte: newPosition },
          },
          { $inc: { position: -1 } }
        );
      } else if (card.position > newPosition) {
        await Card.updateMany(
          {
            listId: card.listId,
            position: { $gte: newPosition, $lt: card.position },
          },
          { $inc: { position: 1 } }
        );
      }

      card.position = newPosition;
      await card.save();

      list.cards.splice(newPosition, 0, cardId);
      await list.save();
    }

    const updatedBoard = await Board.findById(board._id).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    if (!io) {
      console.error("Socket.IO not initialized");
    } else {
      io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
      console.log("Emitted boardUpdated for board:", board._id.toString());
    }

    res.status(200).json({ message: "Card position updated successfully" });
  } catch (error) {
    console.error("Error updating card position:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const assignCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const userId = req.user.id;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.listId);
    const board = await Board.findById(list.boardId);

    if (!board) return res.status(404).json({ message: "Board not found" });

    const member = board.members.find(
      (m) => m.userId.toString() === userId.toString()
    );
    if (!member || (member.role !== "admin" && member.role !== "member")) {
      return res
        .status(403)
        .json({ message: "You don't have permission to assign this card" });
    }

    card.assignedTo = assignedTo;
    await card.save();

    const updatedBoard = await Board.findById(board._id).populate({
      path: "lists",
      populate: { path: "cards" },
    });

    io.to(board._id.toString()).emit("boardUpdated", updatedBoard);
    res.json({ message: "Card assigned successfully", card });
  } catch (err) {
    console.error("Error assigning card:", err.message);
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
  assignCard,
};
