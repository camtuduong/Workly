import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useLanguageStore from "../store/useLanguageStore";
import useThemeStore from "../store/useThemeStore";
import UserInfoDropDown from "./UserInfoDropDown";
import ThemeToggleButton from "./ThemeToggleButton";
import { FiGlobe, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { t } = useTranslation();
  const { setLanguage, updateUserLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-4 shadow-lg ${
        isDark
          ? "bg-gradient-to-r from-[#1E1331] to-[#2A1F42] text-white"
          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      {/* Logo and Brand */}
      <div className="flex items-center space-x-2">
        <div
          className="flex cursor-pointer items-center"
          onClick={() => navigate("/")}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              isDark ? "bg-purple-600" : "bg-purple-700"
            } mr-2 text-xl font-bold text-white shadow-md`}
          >
            W
          </div>
          <span
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Workly
          </span>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-md p-2 ${
            isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-300"
          } transition-colors`}
        >
          {isOpen ? (
            <FiX
              className={`h-6 w-6 ${isDark ? "text-white" : "text-gray-800"}`}
            />
          ) : (
            <FiMenu
              className={`h-6 w-6 ${isDark ? "text-white" : "text-gray-800"}`}
            />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center space-x-8 md:flex">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="group relative">
            <div className="absolute right-0 mt-2 hidden w-48 rounded-md shadow-lg group-hover:block">
              <div
                className={`ring-opacity-5 rounded-md ring-1 ring-black ${
                  isDark ? "bg-[#2A1F42] text-white" : "bg-white text-gray-800"
                }`}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      updateUserLanguage("en");
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      updateUserLanguage("vi");
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* User Info & Dropdown */}
          <UserInfoDropDown />
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className={`absolute top-16 right-0 left-0 p-4 shadow-lg md:hidden ${
            isDark ? "bg-[#2A1F42] text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-200"
              }`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => {
                navigate("/features");
                setIsOpen(false);
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-200"
              }`}
            >
              {t("features")}
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setIsOpen(false);
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-200"
              }`}
            >
              {t("about")}
            </button>
            <div className="border-t border-gray-600 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("language")}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      updateUserLanguage("en");
                    }}
                    className={`rounded px-2 py-1 text-xs ${
                      isDark
                        ? "bg-[#3a2c5a] hover:bg-[#4a3c6a]"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("vi");
                      updateUserLanguage("vi");
                    }}
                    className={`rounded px-2 py-1 text-xs ${
                      isDark
                        ? "bg-[#3a2c5a] hover:bg-[#4a3c6a]"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    VI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
