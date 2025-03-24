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

// Đăng nhập user
const loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log payload nhận được
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password:", { email, password });
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log("Finding user with email:", email);
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Comparing password for user:", email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Generating token for user:", user._id);
    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      token,
      language: user.language,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
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
  loginUser,
  updateLanguage,
};
