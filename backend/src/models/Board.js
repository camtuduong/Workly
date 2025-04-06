const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["admin", "member", "viewer"],
        default: "member",
      },
    },
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

boardSchema.pre("save", function (next) {
  if (
    this.createdBy &&
    (!this.members ||
      !this.members.some(
        (member) => member.userId.toString() === this.createdBy.toString()
      ))
  ) {
    this.members.push({ userId: this.createdBy, role: "admin" });
  }
  next();
});

module.exports = mongoose.model("Board", boardSchema);
