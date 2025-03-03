const express = require("express");
const {
  registerUser,
  loginUser,
  updateLanguage,
  getAllUsers,
} = require("../controller/userController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllUsers);
router.post("/register", registerUser); //Đăng kí user
router.post("/login", loginUser); //Đăng nhập user
router.put("/language", protect, updateLanguage); //cập nhật ngôn ngữ

module.exports = router;
