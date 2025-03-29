import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import useThemeStore from "../store/useThemeStore";
import NavbarIn from "../components/NavbarIn";
import Board from "./Board";

const BoardView = () => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  return (
    <div
      className={`flex h-screen flex-col ${
        theme === "dark"
          ? "bg-[#1E1331] text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Navbar In */}
      <NavbarIn />
      <div>
        {/* Board header */}
        <div
          className={`flex items-center justify-between px-4 py-2 ${
            theme === "dark" ? "bg-[#2a1c4a]" : "bg-white"
          } border-opacity-20 border-t`}
        >
          <div className="flex items-center space-x-4">
            <h1 className="font-semibold"></h1>

            <button className="text-gray-400 hover:text-yellow-400">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>

            <button
              className={`flex items-center space-x-1 rounded px-2 py-1 ${
                theme === "dark" ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Board</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className={`flex items-center space-x-1 rounded px-2 py-1 ${
                theme === "dark" ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Power-ups</span>
            </button>

            <button
              className={`flex items-center space-x-1 rounded px-2 py-1 ${
                theme === "dark" ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Automation</span>
            </button>

            <button
              className={`flex items-center space-x-1 rounded px-2 py-1 ${
                theme === "dark" ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Filters</span>
            </button>

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 font-medium text-white`}
            >
              DT
            </div>

            <button
              className={`flex items-center rounded bg-blue-100 px-3 py-1 font-medium text-blue-700`}
            >
              Share
            </button>

            <button
              className={`rounded p-1 ${
                theme === "dark" ? "hover:bg-[#3a2c5a]" : "hover:bg-gray-100"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Board */}
        <Board />
      </div>
    </div>
  );
};

export default BoardView;
