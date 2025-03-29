const List = require("../models/List");

const Board = require("../models/Board");

const createList = async (req, res) => {
  const { boardId, title } = req.body;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const list = new List({ title, boardId });
    await list.save();

    board.lists.push(list._id);
    await board.save();

    res.status(201).json(list);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateListPosition = async (req, res) => {
  const [listId, newPosition] = req.body;

  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    list.position = newPosition;
    await list.save();

    req.json({ message: "List position update successfully" });
  } catch (error) {
    console.error("Error updating list position", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findById(id);

    if (!list) return res.status(404).json({ message: "List not found" });

    await List.deleteOne({ _id: id });
    await Board.u[dateOne({ _id: list.boardId }, { $pull: { lists: id } })];

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { createList, updateListPosition, deleteList };
