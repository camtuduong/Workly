const express = require("express");
const router = express.Router();

const {
  createList,
  updateListPosition,
  deleteList,
} = require("../controllers/listController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createList);
router.put("/position", authMiddleware, updateListPosition);
router.delete("/:id", authMiddleware, deleteList);

module.exports = router;
