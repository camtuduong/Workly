const express = require("express");
const app = express();

const cors = require("cors"); // Import thư viện CORS

const corsOptions = {
  origin: "http://localhost:5173", // Chỉ cho phép request từ frontend chạy ở port 5173
};

app.use(cors(corsOptions)); // Áp dụng CORS với cấu hình trên

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(8080, () => {
  console.log("Server started on http://localhost:8080");
});
