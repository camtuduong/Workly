const express = require("express");
const {
  getAllUsers,
  checkUser,
  registerUser,
  loginUser,
  updateLanguage,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check", checkUser);
router.put("/language", authMiddleware, updateLanguage);
router.get("/", getAllUsers);

module.exports = router;
