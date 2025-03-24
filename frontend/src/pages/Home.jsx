import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import useThemeStore from "../store/useThemeStore";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Thêm loading từ useAuth
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  // Nếu đang loading, hiển thị thông báo "Loading..."
  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "dark" ? "bg-[#1E1331]" : "bg-gray-100"
        }`}
      >
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#1E1331]" : "bg-gray-100"
      }`}
    >
      <Navbar />
      <div className="flex h-screen items-center justify-center">
        <div
          className={`text-center ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          <h2 className="text-4xl font-bold">
            {t("welcome")} {user ? user.username : t("guest")}!
          </h2>
          <p
            className={`mt-2 text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {user ? t("welcomeMessageLoggedIn") : t("welcomeMessageGuest")}
          </p>
          <div className="mt-6 space-x-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className={`rounded-lg p-3 font-semibold text-white transition duration-700 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-300"
                    : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-200"
                }`}
              >
                {t("dashboard")}
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className={`rounded-lg p-3 font-semibold text-white transition duration-700 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-300"
                    : "bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-200"
                }`}
              >
                {t("signin")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
