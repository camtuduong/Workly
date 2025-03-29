import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useLanguageStore from "../store/useLanguageStore";
import useThemeStore from "../store/useThemeStore";

export default function UserInfoDropDown() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const { setLanguage, updateUserLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    if (user) {
      await updateUserLanguage(lang);
    }
    setIsOpen(false); // Đóng dropdown sau khi chọn
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsOpen(false); // Đóng dropdown sau khi chọn
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Đóng dropdown sau khi logout
    navigate("/"); // Chuyển hướng về trang chủ sau khi logout
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // Đóng dropdown sau khi điều hướng
  };

  if (loading) {
    return null;
  }
  return (
    <div>
      <div className="relative">
        <div
          className="flex cursor-pointer items-center space-x-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user ? (
            <>
              <span
                className={`font-semibold ${
                  theme === "dark" ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {user.username} {/* Làm nổi bật username */}
              </span>
            </>
          ) : (
            <span
              className={`font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("guest")}
            </span>
          )}
          <svg
            className={`h-4 w-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute right-0 z-10 mt-2 w-56 transform rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
              theme === "dark" ? "bg-[#2A1F42]" : "bg-white"
            } ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            {/* User Info (nếu đã đăng nhập) */}
            {user && (
              <div
                className={`border-b px-4 py-3 ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.username}
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email} {/* Hiển thị email */}
                </p>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-1">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      theme === "dark"
                        ? "text-white hover:bg-[#6f5a84]"
                        : "text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {t("dashboard")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      theme === "dark"
                        ? "text-white hover:bg-[#6f5a84]"
                        : "text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigate("/signin")}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    theme === "dark"
                      ? "text-white hover:bg-[#6f5a84]"
                      : "text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {t("signIn")}
                </button>
              )}
              <button
                onClick={() => handleLanguageChange("en")}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  theme === "dark"
                    ? "text-white hover:bg-[#6f5a84]"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("vi")}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  theme === "dark"
                    ? "text-white hover:bg-[#6f5a84]"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                Tiếng Việt
              </button>
              <button
                onClick={handleToggleTheme}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  theme === "dark"
                    ? "text-white hover:bg-[#6f5a84]"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
