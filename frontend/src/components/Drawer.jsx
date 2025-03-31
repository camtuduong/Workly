import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiSettings,
  FiTable,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiStar,
} from "react-icons/fi";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [boards, setBoards] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/boards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBoards(data.boards || []);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    if (user) {
      fetchBoards();
    }
  }, [user]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getBoardColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative flex h-screen">
      {/* Drawer content */}
      <div
        className={`h-full bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        } overflow-hidden shadow-xl`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-700 p-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-green-600 text-xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "8"}
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="truncate text-lg font-semibold">
                  {user ? `${user.username}'s workspace` : "Workspace"}
                </h2>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-400">
                    Free
                  </span>
                </div>
              </div>
              <button
                onClick={toggleDrawer}
                className="text-gray-400 hover:text-white"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-6">
              {/* Main Navigation */}
              <div className="space-y-1">
                <button
                  onClick={() => navigate("/boards")}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive("/boards")
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <FiGrid className="mr-3 h-5 w-5" />
                  <span>Boards</span>
                </button>

                <button
                  onClick={() => navigate("/members")}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive("/members")
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <FiUsers className="mr-3 h-5 w-5" />
                  <span>Members</span>
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive("/settings")
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <FiSettings className="mr-3 h-5 w-5" />
                  <span>Workspace settings</span>
                </button>
              </div>

              {/* Workspace Views */}
              <div>
                <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Workspace views
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => navigate("/table")}
                    className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive("/table")
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <FiTable className="mr-3 h-5 w-5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => navigate("/calendar")}
                    className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive("/calendar")
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <FiCalendar className="mr-3 h-5 w-5" />
                    <span>Calendar</span>
                  </button>
                </div>
              </div>

              {/* Boards List */}
              <div>
                <div className="mb-2 flex items-center justify-between px-4">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Your boards
                  </h3>
                  <button
                    onClick={() => navigate("/boards")}
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
                    title="Add new board"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-64 space-y-1 overflow-y-auto pr-2">
                  {boards.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-400">
                      No boards yet
                    </div>
                  ) : (
                    boards.map((board, index) => (
                      <button
                        key={board._id}
                        onClick={() => navigate(`/board/${board._id}`)}
                        className={`group flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                          location.pathname === `/board/${board._id}`
                            ? "bg-gray-700 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div
                          className={`mr-3 h-5 w-5 rounded ${getBoardColor(index)}`}
                        />
                        <span className="flex-1 truncate">{board.title}</span>
                        <FiStar
                          className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-yellow-400"
                          title="Star this board"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4">
            <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-lg">
              Try Premium Free
            </button>
          </div>
        </div>
      </div>

      {/* Vertical toggle button for closed drawer */}
      {!isOpen && (
        <button
          onClick={toggleDrawer}
          className="relative top-0 left-0 flex h-full w-6 items-center justify-center bg-gray-900 text-gray-500 hover:text-white"
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="h-1 w-1 rounded-full bg-gray-500"></div>
            <FiChevronRight className="h-4 w-4" />
            <div className="h-1 w-1 rounded-full bg-gray-500"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default Drawer;
