const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, listController.createList);
router.delete("/:id", authMiddleware, listController.deleteList);
router.put("/position", authMiddleware, listController.updateListPosition);

module.exports = router;
