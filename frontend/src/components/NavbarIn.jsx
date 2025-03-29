import React from "react";
import useThemeStore from "../store/useThemeStore";
import { useTranslation } from "react-i18next";
import ThemeToggleButton from "./ThemeToggleButton";
import UserInfoDropDown from "./UserInfoDropDown";

export default function NavbarIn() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <div>
      {" "}
      {/* Top Navigation Bar */}
      <header
        className={`flex items-center justify-between px-4 py-2 ${
          theme === "dark" ? "bg-[#2a1c4a]" : "bg-white"
        } z-10 shadow-sm`}
      >
        <div className="flex items-center">
          {/* App icon */}
          <button className="hover:bg-opacity-80 rounded-md p-2">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="ml-4 text-lg font-bold">Workly</div>

          <button
            className={`ml-2 rounded-md bg-blue-500 px-4 py-1 font-medium text-white hover:bg-blue-600`}
          >
            Create
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Color */}
          <ThemeToggleButton />

          {/* Search */}
          <div
            className={`relative hidden md:block ${
              theme === "dark" ? "bg-[#3a2c5a]" : "bg-gray-100"
            } rounded-md`}
          >
            <input
              type="text"
              placeholder={t("search", "Search")}
              className={`w-64 rounded-md px-3 py-1 pr-8 ${
                theme === "dark"
                  ? "bg-[#3a2c5a] placeholder-gray-400"
                  : "bg-gray-100 placeholder-gray-500"
              } border-none focus:ring-0 focus:outline-none`}
            />
            <svg
              className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* User avatar */}
          <UserInfoDropDown />
        </div>
      </header>
    </div>
  );
}
