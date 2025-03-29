const mongoose = require("mongoose");

const boardSchema = new mongoose.mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: Strong, default: "member" },
    },
  ],
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
  createdAt: { type: Date, default: Date.now },
});

const Board = mongoose.model("Board", boardSchema);
module.exports = Board;
