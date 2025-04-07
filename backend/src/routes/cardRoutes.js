const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", authMiddleware, cardController.createCard);
router.get("/:id", authMiddleware, cardController.getCard);
router.put("/position", authMiddleware, cardController.updateCardPosition);

router.put("/:id", authMiddleware, cardController.updateCard);
router.delete("/:id", authMiddleware, cardController.deleteCard);

router.put("/:id/assign", authMiddleware, cardController.assignCard);

router.post(
  "/:id/attachments",
  authMiddleware,
  upload.single("file"),
  cardController.addAttachment
);

module.exports = router;
