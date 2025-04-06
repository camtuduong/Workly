const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        language: user.language || "en",
      },
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateToken(user._id);
    res.json({ token: newAccessToken });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(403).json({ message: "Refresh token invalid or expired" });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        language: user.language || "en",
      },
    });
  } catch (error) {
    console.error("Error in verifyToken:", error);
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = { login, refreshAccessToken, verifyToken };
