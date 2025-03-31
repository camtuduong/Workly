const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("List", listSchema);
