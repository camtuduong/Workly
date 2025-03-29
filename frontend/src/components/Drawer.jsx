import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiSettings,
  FiTable,
  FiCalendar,
} from "react-icons/fi";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true); // Drawer mặc định mở
  const { t } = useTranslation();
  const { user } = useAuth();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Danh sách boards giả lập (sẽ thay bằng API sau)
  const boards = [
    { id: "1", title: "English" },
    { id: "2", title: "Website" },
  ];

  return (
    <div className="flex">
      {/* Drawer */}
      <div
        className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          {/* Workspace Name */}
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-lg font-bold">
              {user ? `${user.username}'s workspace` : t("drawer.workspace")}
            </span>
            <span className="rounded bg-green-500 px-2 py-1 text-xs">
              {t("drawer.free")}
            </span>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700">
              <FiGrid className="h-5 w-5" />
              <span>{t("drawer.boards")}</span>
            </button>

            <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700">
              <FiUsers className="h-5 w-5" />
              <span>{t("drawer.members")}</span>
            </button>

            <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700">
              <FiSettings className="h-5 w-5" />
              <span>{t("drawer.settings")}</span>
            </button>
          </div>

          {/* Workspace Views */}
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-400">
              {t("drawer.views")}
            </h3>
            <div className="space-y-1">
              <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700">
                <FiTable className="h-5 w-5" />
                <span>{t("drawer.table")}</span>
              </button>
              <button className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700">
                <FiCalendar className="h-5 w-5" />
                <span>{t("drawer.calendar")}</span>
              </button>
            </div>
          </div>

          {/* Your Boards */}
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-400">
              {t("drawer.yourBoards")}
            </h3>
            <div className="space-y-1">
              {boards.map((board) => (
                <button
                  key={board.id}
                  className="flex w-full items-center space-x-2 rounded px-4 py-2 text-left hover:bg-gray-700"
                >
                  <span>{board.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Try Premium Free */}
        <div className="absolute bottom-4 left-4">
          <button className="rounded bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white">
            {t("drawer.tryPremium")}
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleDrawer}
        className="flex h-10 items-center justify-center bg-gray-800 p-2 text-white"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
    </div>
  );
};

export default Drawer;
