# Workly - Full-Stack Project 🚀

Workly là một ứng dụng quản lý công việc trực quan, cho phép người dùng tạo bảng, danh sách, thẻ (cards) và kéo thả chúng dễ dàng. Dự án được xây dựng với **ReactJS (Vite) cho Frontend** và **Node.js + Express cho Backend**, hỗ trợ **real-time, authentication, và drag & drop**.

## 🌟 Tính năng chính

✅ Quản lý bảng, danh sách, thẻ (cards)
✅ Kéo thả card giữa các danh sách 🎯
✅ Cập nhật **real-time** với WebSocket 🔄
✅ Hệ thống **đăng nhập & bảo mật JWT** 🔐
✅ Hỗ trợ **tìm kiếm, gán người dùng, deadline** 🔍
✅ Giao diện hiện đại với **Dark Mode** 🌙
✅ Quản lý công việc theo giai đoạn 📅 (TODO, DOING, DONE)

## 📌 Công nghệ sử dụng

### 🖥 Frontend (React + Vite)

- **ReactJS + Vite** - Framework nhanh, nhẹ
- **Tailwind CSS** - Tạo giao diện đẹp, tối ưu
- **React DnD** - Hỗ trợ kéo thả
- **React Query** - Quản lý state API tối ưu

### 🔧 Backend (Node.js + Express)

- **Node.js + Express** - Viết API nhanh, dễ mở rộng
- **MongoDB + Mongoose** - Lưu trữ dữ liệu linh hoạt
- **Socket.io** - Cập nhật **real-time**
- **JWT Authentication** - Xác thực bảo mật
- **Redis** - Cache dữ liệu tăng hiệu suất

### ☁️ Deployment & DevOps

- **Docker** - Đóng gói ứng dụng
- **CI/CD với GitHub Actions** - Tự động deploy
- **Vercel (Frontend) + Railway (Backend)** - Deploy miễn phí

## 🚀 Cách chạy dự án

### 1️⃣ Clone repo

```sh
git https://github.com/camtuduong/Workly.git
cd workly
```

### 2️⃣ Cài đặt Backend

```sh
cd backend
npm install
cp .env.example .env  # Cấu hình biến môi trường
npm start
```

### 3️⃣ Cài đặt Frontend

```sh
cd ../frontend
npm install
npm run dev
```

### 4️⃣ Truy cập web

- **Frontend:** `http://localhost:5173/`
- **Backend API:** `http://localhost:8000/`

## 📌 Môi trường `.env` mẫu

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URL=mongodb://localhost:27017/dbconnect
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
