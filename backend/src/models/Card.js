const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  position: {
    type: Number,
    required: true,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  attachments: [
    {
      filename: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Card", cardSchema);
