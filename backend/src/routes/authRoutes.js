const express = require("express");
const router = express.Router();
const {
  login,
  verifyToken,
  refreshAccessToken,
} = require("../controllers/authController");

router.post("/login", login);
router.get("/verify", verifyToken);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
