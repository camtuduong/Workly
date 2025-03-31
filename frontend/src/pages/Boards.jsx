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

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["polling"], // Chỉ sử dụng WebSocket, bỏ polling để kiểm tra
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
    <div className="app min-h-screen bg-[#1E1331] p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("boards")}</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          {t("logout")}
        </button>
      </div>

      {isAddingBoard ? (
        <div className="mb-6">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="mr-2 rounded border bg-[#2A1F42] p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder={t("enterBoardTitle")}
          />
          <button
            onClick={handleCreateBoard}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            {t("createBoard")}
          </button>
          <button
            onClick={() => setIsAddingBoard(false)}
            className="ml-2 text-gray-400 hover:text-gray-200"
          >
            {t("cancel")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingBoard(true)}
          className="mb-6 rounded bg-gray-200 px-4 py-2 text-black"
        >
          {t("addBoard")}
        </button>
      )}

      <div className="boards grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <div
            key={board._id}
            className="board rounded bg-[#2A1F42] p-4 shadow"
          >
            {editingBoardId === board._id ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="rounded border bg-[#3A2F52] p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder={t("enterNewTitle")}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateBoard(board._id)}
                    className="rounded bg-blue-500 px-4 py-1 text-white"
                  >
                    {t("save")}
                  </button>
                  <button
                    onClick={() => setEditingBoardId(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to={`/board/${board._id}`}>
                  <h2 className="text-xl font-semibold text-purple-400 hover:underline">
                    {board.title}
                  </h2>
                </Link>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditBoard(board)}
                    className="rounded bg-yellow-500 px-4 py-1 text-white"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteBoard(board._id)}
                    className="rounded bg-red-500 px-4 py-1 text-white"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;
