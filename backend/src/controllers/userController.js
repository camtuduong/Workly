const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Kiểm tra user tồn tại
const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    res.json({
      exists: !!user,
      message: user ? "User exists." : "User not found.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Đăng ký user mới
const registerUser = async (req, res) => {
  try {
    const { username, email, password, language } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      language,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
};

// Cập nhật ngôn ngữ của user
const updateLanguage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { language } = req.body;

    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.language = language;
    await user.save();

    res.json({ message: "Language updated successfully", language });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách user
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");

    if (!users.length) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  checkUser,
  registerUser,
  updateLanguage,
};
