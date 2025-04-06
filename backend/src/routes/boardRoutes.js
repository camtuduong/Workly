const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, boardController.getAllBoards);
router.get("/:id", authMiddleware, boardController.getBoard);
router.post("/", authMiddleware, boardController.createBoard);
router.put("/:id", authMiddleware, boardController.updateBoard);
router.delete("/:id", authMiddleware, boardController.deleteBoard);

//members
router.get(
  "/:boardId/members",
  authMiddleware,
  boardController.getBoardMembers
);
router.put("/:boardId/members", authMiddleware, boardController.addMember);
router.put(
  "/:boardId/members/remove",
  authMiddleware,
  boardController.removeMember
);
module.exports = router;
