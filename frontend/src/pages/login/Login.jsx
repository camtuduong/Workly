import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/AuthBackground"; // Import component
import { useState } from "react";
import { loginUser } from "../../api/userApi";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.language) {
        localStorage.setItem("language", result.language);
      }
      // console.log(result);
      setMessage("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      setMessage(error.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1331]">
      <AuthBackground /> {/* Dùng lại phần bên trái */}
      {/* Right Side - Sign In Form */}
      <div className="flex w-4/10 items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-white">SIGN IN</h2>
          <p className="text-gray-400">Sign in with email address</p>

          {/* Input Field */}
          <form action="" className="space-y-4" onSubmit={handleSubmit}>
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
            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 p-3 font-semibold text-white transition duration-700 hover:from-purple-300"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>
          {/* Hiển thị thông báo */}
          {message && <p className="text-red-500">{message}</p>}

          {/* Divider */}
          <div className="flex items-center justify-center text-gray-400">
            Or continue with
          </div>

          {/* Register Button */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2A1F42] p-3 text-white transition duration-500 hover:bg-[#6f5a84]"
            >
              <span>Create an account</span>
            </button>
          </div>

          {/* Terms & Conditions */}
          <p className="text-center text-xs text-gray-400">
            By registering you agree to our{" "}
            <a href="#" className="text-purple-400">
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
