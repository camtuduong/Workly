import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../api/boardApi";
import { SOCKET_URL } from "../api/config";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Boards = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [isHovering, setIsHovering] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
      const userId = localStorage.getItem("userId");
      if (userId) {
        newSocket.emit("setUserId", userId);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    newSocket.on("boardCreated", (newBoard) => {
      console.log("New board created:", newBoard);
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    });

    newSocket.on("boardUpdated", (updatedBoard) => {
      console.log("Board updated:", updatedBoard);
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === updatedBoard._id ? updatedBoard : board,
        ),
      );
    });

    newSocket.on("boardDeleted", (boardId) => {
      console.log("Board deleted:", boardId);
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board._id !== boardId),
      );
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error.message);
      }
    };

    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      console.log("Token before creating board:", token);
      await createBoard(newBoardTitle);
      setNewBoardTitle("");
      setIsAddingBoard(false);
    } catch (error) {
      console.error("Error creating board:", error.message);
    }
  };

  const handleEditBoard = (board) => {
    setEditingBoardId(board._id);
    setEditTitle(board.title);
  };

  const handleUpdateBoard = async (boardId) => {
    try {
      await updateBoard(boardId, editTitle);
      setEditingBoardId(null);
      setEditTitle("");
    } catch (error) {
      console.error("Error updating board:", error.message);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId);
    } catch (error) {
      console.error("Error deleting board:", error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1331] to-[#2D1B4A] p-6 text-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-[#2A1F42]/60 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-xl font-bold">
              B
            </div>
            <h1 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
              {t("boards")}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white shadow-lg transition-all hover:shadow-red-500/25 active:scale-95"
          >
            {t("logout")}
          </button>
        </div>

        {/* Add Board Section */}
        <div className="mb-8 rounded-lg bg-[#2A1F42]/60 p-6 shadow-xl backdrop-blur-sm">
          {isAddingBoard ? (
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                className="flex-1 rounded-lg border border-purple-500/30 bg-[#3A2F52] p-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                placeholder={t("enterBoardTitle")}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateBoard}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:shadow-purple-500/25 active:scale-95"
                >
                  {t("createBoard")}
                </button>
                <button
                  onClick={() => setIsAddingBoard(false)}
                  className="rounded-lg border border-gray-600 px-6 py-3 text-gray-300 transition-all hover:bg-gray-700/30 active:scale-95"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingBoard(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-400/30 bg-[#2A1F42]/60 py-4 text-purple-300 transition-all hover:border-purple-400/60 hover:text-purple-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              {t("addBoard")}
            </button>
          )}
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg bg-[#2A1F42]/60 p-8 text-center">
              <div className="mb-4 rounded-full bg-purple-500/20 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-300"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-purple-300">
                Chưa có bảng nào
              </h3>
              <p className="text-purple-300/70">Tạo bảng đầu tiên để bắt đầu</p>
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board._id}
                onMouseEnter={() => setIsHovering(board._id)}
                onMouseLeave={() => setIsHovering(null)}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2A1F42] to-[#3A2F52] p-5 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-purple-500/10"
              >
                {/* Decoration circles */}
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-purple-600/10"></div>
                <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-purple-600/5"></div>

                {editingBoardId === board._id ? (
                  <div className="relative z-10 flex flex-col space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="rounded-lg border border-purple-500/30 bg-[#3A2F52] p-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                      placeholder={t("enterNewTitle")}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateBoard(board._id)}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:shadow-blue-500/25 active:scale-95"
                      >
                        {t("save")}
                      </button>
                      <button
                        onClick={() => setEditingBoardId(null)}
                        className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 transition-all hover:bg-gray-700/30 active:scale-95"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col space-y-4">
                    <Link to={`../board/${board._id}`} className="mb-4 block">
                      <h2 className="text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                        {board.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-400">
                        Nhấn để xem chi tiết bảng này
                      </p>
                    </Link>
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => handleEditBoard(board)}
                        className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-sm text-white shadow-lg transition-all hover:shadow-amber-500/25 active:scale-95"
                      >
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          {t("edit")}
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board._id)}
                        className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-sm text-white shadow-lg transition-all hover:shadow-red-500/25 active:scale-95"
                      >
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          {t("delete")}
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Boards;
