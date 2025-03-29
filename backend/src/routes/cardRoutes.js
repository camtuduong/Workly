const express = require("express");
const router = express.Router();

const {
  createCard,
  updateCard,
  updateCardPosition,
  deleteCard,
  addComment,
} = require("../controllers/cardController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createCard);
router.put("/:id", authMiddleware, updateCard);
router.put("/position", authMiddleware, updateCardPosition);
router.delete("/:id", authMiddleware, deleteCard);
router.post("/:id/comments", authMiddleware, addComment);

module.exports = router;
