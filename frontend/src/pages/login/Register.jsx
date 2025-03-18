import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/AuthBackground"; // Import component

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#1E1331]">
      <AuthBackground /> {/* Dùng lại phần bên trái */}
      {/* Right Side - Register Form */}
      <div className="flex w-4/10 items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-white">REGISTER</h2>
          <p className="text-gray-400">Create a new account</p>

          {/* Input Fields */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Yourname@gmail.com"
              className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
            />
          </div>

          {/* Register Button */}
          <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 p-3 font-semibold text-white transition duration-700 hover:from-purple-300">
            Register
          </button>

          {/* Sign In Link */}
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
