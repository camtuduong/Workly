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
  const { theme, toggleTheme } = useThemeStore();
  const { setLanguage, updateUserLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    if (user) {
      await updateUserLanguage(lang);
    }
    setIsOpen(false);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      <div className="relative">
        {/* User Info Button */}
        <div
          className="hover:bg-opacity-90 flex cursor-pointer items-center space-x-3 rounded-full px-3 py-1.5 transition-colors duration-200 hover:shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-purple-600 text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span
                className={`font-semibold ${
                  theme === "dark" ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {user.username}
              </span>
            </>
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-400 text-white">
                G
              </div>
              <span
                className={`font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("guest")}
              </span>
            </>
          )}
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute right-0 z-10 mt-2 w-56 overflow-hidden rounded-lg shadow-lg ring-1 ${
              theme === "dark"
                ? "bg-[#2A1F42] ring-gray-700"
                : "bg-white ring-gray-200"
            } transition-all duration-200 ease-in-out`}
          >
            {user && (
              <div
                className={`border-b px-4 py-3 ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-purple-600 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
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
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="py-1">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                      theme === "dark"
                        ? "text-white hover:bg-[#6f5a84]"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {t("logout")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigate("/signin")}
                  className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                    theme === "dark"
                      ? "text-white hover:bg-[#6f5a84]"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  {t("signIn")}
                </button>
              )}

              <div
                className={`mx-3 my-1 ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                } border-t`}
              ></div>

              <div className="px-3 py-2">
                <p
                  className={`mb-2 text-xs font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("language")}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`flex-1 rounded px-2 py-1 text-xs ${
                      theme === "dark"
                        ? "hover:bg-[#6f5a84]"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("vi")}
                    className={`flex-1 rounded px-2 py-1 text-xs ${
                      theme === "dark"
                        ? "hover:bg-[#6f5a84]"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>

              <div
                className={`mx-3 my-1 ${
                  theme === "dark" ? "border-gray-600" : "border-gray-200"
                } border-t`}
              ></div>

              <button
                onClick={handleToggleTheme}
                className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                  theme === "dark"
                    ? "text-white hover:bg-[#6f5a84]"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {theme === "light" ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    Dark Mode
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Light Mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
