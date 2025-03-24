import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/AuthBackground"; // Import component
import { registerUser } from "../../api/userApi";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      const result = await registerUser(username, email, password);
      setMessage("Đăng ký thành công");
      navigate("/login");
    } catch (error) {
      setMessage(error.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1331]">
      <AuthBackground /> {/* Dùng lại phần bên trái */}
      {/* Right Side - Register Form */}
      <div className="flex w-4/10 items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-white">REGISTER</h2>
          <p className="text-gray-400">Create a new account</p>

          {/* Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
                required
              />
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 p-3 font-semibold text-white transition duration-700 hover:from-purple-300"
            >
              Register
            </button>
          </form>
          {/* Thông báo */}
          {message && <p className="text-center text-white">{message}</p>}

          {/* Link đăng nhập */}
          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-400 underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
