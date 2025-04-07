import React from "react";
import useThemeStore from "../store/useThemeStore";
import { useTranslation } from "react-i18next";
import ThemeToggleButton from "./ThemeToggleButton";
import UserInfoDropDown from "./UserInfoDropDown";
import { FiSearch, FiGrid, FiHome, FiPlus, FiBell } from "react-icons/fi";

export default function NavbarIn() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  return (
    <div>
      <header
        className={`fixed top-0 right-0 left-0 z-20 flex h-16 items-center justify-between px-4 shadow-lg ${
          isDark
            ? "bg-gradient-to-r from-[#2A1F42] to-[#352a50] text-white"
            : "bg-gradient-to-r from-white to-purple-50 text-gray-800"
        } transition-colors duration-300`}
      >
        {/* Left section with logo and navigation */}
        <div className="flex items-center space-x-6">
          <div
            className={`flex items-center text-xl font-bold ${
              isDark ? "text-purple-300" : "text-purple-700"
            }`}
          >
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-md">
              W
            </div>
            Workly
          </div>

          {/* Navigation links */}
          <nav className="hidden items-center space-x-1 md:flex">
            <a
              href="/"
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:bg-[#3a2c5a] hover:text-white"
                  : "text-gray-700 hover:bg-purple-100"
              }`}
            >
              <FiHome className="mr-1.5" />
              Home
            </a>
          </nav>
        </div>

        {/* Right section with search and user info */}
        <div className="flex items-center space-x-3">
          {/* Search bar */}
          <div
            className={`relative hidden rounded-lg md:block ${
              isDark ? "bg-[#3a2c5a]" : "bg-gray-100"
            }`}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("search", "Search")}
              className={`w-64 rounded-lg py-2 pr-4 pl-10 ${
                isDark
                  ? "bg-[#3a2c5a] text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              } border-none focus:ring-1 ${
                isDark ? "focus:ring-purple-500" : "focus:ring-purple-400"
              } transition-all duration-200 focus:outline-none`}
            />
          </div>

          {/* Notifications */}
          <button
            className={`relative rounded-full p-2 ${
              isDark ? "hover:bg-[#3a2c5a]" : "hover:bg-purple-100"
            } transition-colors`}
          >
            <FiBell
              size={20}
              className={isDark ? "text-gray-300" : "text-gray-600"}
            />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggleButton />

          {/* User dropdown */}
          <UserInfoDropDown />
        </div>
      </header>
    </div>
  );
}
