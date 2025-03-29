import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useLanguageStore from "../store/useLanguageStore";
import useThemeStore from "../store/useThemeStore";
import UserInfoDropDown from "./UserInfoDropDown";
import ThemeToggleButton from "./ThemeToggleButton";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { t } = useTranslation();
  const { setLanguage, updateUserLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`flex items-center justify-between p-4 shadow-md ${
        theme === "dark" ? "bg-[#1E1331]" : "bg-gray-200"
      }`}
    >
      {/* Logo */}
      <div
        className={`cursor-pointer text-2xl font-bold ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
        onClick={() => navigate("/")}
      >
        MyApp
      </div>
      <div className="flex items-center justify-between">
        {/* Theme */}
        <div className="px-5">
          <ThemeToggleButton className />
        </div>
        {/* User Info & Dropdown */}
        <UserInfoDropDown />
      </div>
    </nav>
  );
};

export default Navbar;
