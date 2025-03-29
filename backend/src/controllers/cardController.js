const Card = require("../models/Card");
const List = require("../models/List");

const createCard = async (req, res) => {
  const { listId, title } = req.body;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const card = new Card({ title, listId, boardId: list.boardId });
    await card.save();

    list.cards.push(card._id);
    await list.save();

    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating card", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.title = title || card.title;
    card.description = description || card.description;
    await card.save();

    res.json(card);
  } catch (error) {
    console.error("Error updating card".error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCardPosition = async (req, res) => {
  const { cardId, newListId, newPosition } = req.body;

  try {
    const card = Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const oldList = await List.findById(card.listId);
    const newList = await List.findById(newListId);

    if (!oldList || !newList)
      return res.status(404).json({ message: "List not found" });

    oldList.cards = oldList.cards.filter((c) => c.toString() !== cardId);
    await oldList.save();

    newList.cards.push(cardId);
    await newList.save();

    card.listId = newListId;
    card.position = newPosition;
    await card.save();

    res.json({ message: "Card position updated successfully" });
  } catch (error) {
    console.error("Error updating card position");
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    const card = Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    await Card.deleteOne({ _id: id });
    await List.updateOne(
      {
        _id: card.listId,
      },
      { $pull: { cards: id } }
    );

    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  try {
    const card = Card.findById(id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    card.comments.push({ userId, content });
    await card.save();

    res.json(card);
  } catch (error) {
    console.error("Error adding comment", error);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  createCard,
  updateCard,
  updateCardPosition,
  deleteCard,
  addComment,
};
