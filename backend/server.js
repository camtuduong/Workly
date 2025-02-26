const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

//env
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on
    http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

const boardSchema = new mongoose.Schema({
  name: String,
  owner: String,
  list: [String],
});

const BoardModel = mongoose.model("boards", boardSchema);

app.get("/boards", async (req, res) => {
  const boardData = await BoardModel.find();
  res.json(boardData);
});
