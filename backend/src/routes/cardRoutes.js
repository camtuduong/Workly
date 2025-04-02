const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, cardController.createCard);
router.get("/:id", authMiddleware, cardController.getCard);
router.put("/position", authMiddleware, cardController.updateCardPosition);

router.put("/:id", authMiddleware, cardController.updateCard);
router.delete("/:id", authMiddleware, cardController.deleteCard);

module.exports = router;
