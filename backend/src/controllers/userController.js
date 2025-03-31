const User = require("../models/User");
const bcrypt = require("bcryptjs");

let io;
const setIo = (socketIo) => {
  io = socketIo;
};

// Kiểm tra user tồn tại
const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      language,
    });

    await newUser.save();

    // Gửi sự kiện userRegistered đến tất cả client
    io.emit("userRegistered", {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      language: newUser.language,
    });

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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.language = language;
    await user.save();

    // Gửi sự kiện userUpdated đến tất cả client
    io.emit("userUpdated", {
      userId: user._id,
      language: user.language,
    });

    res.json({ message: "Language updated successfully", language });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách user
const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({ message: "No User Found" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  setIo,
  getAllUser,
  checkUser,
  registerUser,
  updateLanguage,
};
