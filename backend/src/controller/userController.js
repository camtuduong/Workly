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

    if (user) {
      return res.json({ exists: true, message: "User exists." });
    } else {
      return res.json({ exists: false, message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Đăng ký user mới
const registerUser = async (req, res) => {
  try {
    const { name, email, password, language } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      language: language || "en",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error registering user" });
  }
};

//  Đăng nhập user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      language: user.language,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật ngôn ngữ của user
const updateLanguage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { language } = req.body;

    const user = await Users.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.language = language;
    await user.save();

    res.json({ message: "Language updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy danh sách user
const getAllUsers = async (req, res) => {
  try {
    //Lấy danh sách user nhưng ẩn password
    const users = await Users.find().select("-password");

    //nếu không có user
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.json(users); //trả về danh sách user
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  checkUser,
  registerUser,
  loginUser,
  updateLanguage,
};
