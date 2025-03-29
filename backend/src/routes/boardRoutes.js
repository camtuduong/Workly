const express = require("express");
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoard,
  deleteBoard,
  addMemberToBoard,
} = require("../controllers/boardController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createBoard);
router.get("/", authMiddleware, getBoards);
router.get("/:id", authMiddleware, getBoard);
router.delete("/:id", authMiddleware, deleteBoard);
router.post("/:id/members", authMiddleware, addMemberToBoard);

module.exports = router;
