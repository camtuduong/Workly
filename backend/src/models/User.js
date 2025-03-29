const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    language: { type: String, default: "en" },
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
