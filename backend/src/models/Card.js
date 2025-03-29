const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model("Card".cardSchema);
