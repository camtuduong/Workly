import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/AuthBackground";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function SignIn() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth(); // Lấy login, user, và loading từ AuthContext
  const { t } = useTranslation(); // Sử dụng i18n
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra nếu user đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (!loading && user) {
      navigate("/"); // Hoặc navigate("/") nếu bạn muốn về trang chủ
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage(t("passwordTooShort"));
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password); // Sử dụng login từ AuthContext
      setMessage(t("loginSuccess"));
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      setMessage(error.message || t("loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#1E1331]">
      <AuthBackground />
      <div className="flex w-4/10 items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-white">{t("signIn")}</h2>
          <p className="text-gray-400">{t("signInWithEmail")}</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#2A1F42] p-3 text-white focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 p-3 font-semibold text-white transition duration-700 hover:from-purple-300"
            >
              {isLoading ? t("loading") : t("signIn")}
            </button>
          </form>
          {message && <p className="text-red-500">{message}</p>}

          <div className="flex items-center justify-center text-gray-400">
            {t("orContinueWith")}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2A1F42] p-3 text-white transition duration-500 hover:bg-[#6f5a84]"
            >
              <span>{t("createAccount")}</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            {t("termsAndConditions")}{" "}
            <a href="#" className="text-purple-400">
              {t("termsAndConditionsLink")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
