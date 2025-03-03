const mongoose = require("mongoose");

//user model
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    language: { type: String, default: "en" },
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);
module.exports = Users;
