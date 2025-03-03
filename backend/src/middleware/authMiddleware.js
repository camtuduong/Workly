const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; //lấy token từ header

      // giải mã token để lấy userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded.userId; //lưu userId vào request
      next(); //chuyển đến API tiếp theo
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else return res.status(401).json({ message: "No token provided" });
};
module.exports = protect;
