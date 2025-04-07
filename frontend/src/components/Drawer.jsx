import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBoards } from "../api/boardApi";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/config";
import {
  FiGrid,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiStar,
} from "react-icons/fi";

const RoleBadge = ({ role }) => (
  <span
    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
      role === "admin"
        ? "bg-green-600 text-white"
        : role === "viewer"
          ? "bg-gray-600 text-white"
          : "bg-yellow-600 text-white"
    }`}
  >
    {role}
  </span>
);

const Drawer = ({ isOpen, toggleDrawer }) => {
  const [boards, setBoards] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState("");

  const myBoards = boards.filter((board) => board.role === "admin");
  const sharedBoards = boards.filter((board) => board.role !== "admin");

  useEffect(() => {
    const socketIo = io(SOCKET_URL);
    setSocket(socketIo);

    socketIo.on("boardCreated", (newBoard) => {
      const isCreator = String(newBoard.createdBy) === String(user._id);
      setBoards((prev) => [
        ...prev,
        {
          ...newBoard,
          role: isCreator ? "admin" : "member",
        },
      ]);
    });

    socketIo.on("boardUpdated", (updatedBoard) => {
      setBoards((prev) =>
        prev.map((b) => (b._id === updatedBoard._id ? updatedBoard : b)),
      );
    });

    socketIo.on("boardDeleted", (boardId) => {
      setBoards((prev) => prev.filter((b) => b._id !== boardId));
    });

    socketIo.on("memberRoleUpdated", ({ boardId, updatedMember }) => {
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board._id === boardId) {
            if (String(updatedMember.userId) === String(user._id)) {
              return {
                ...board,
                role: updatedMember.role,
              };
            }
          }
          return board;
        }),
      );
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards();
        setBoards(data || []);
      } catch (err) {
        console.error("Error fetching boards:", err);
      }
    };

    if (user) fetchBoards();
  }, [user]);

  const isActive = (path) => location.pathname === path;

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

  const handleSelectBoard = (id) => {
    setSelectedBoardId(id);
  };

  const handleShowMembers = () => {
    if (selectedBoardId) {
      navigate(`/dashboard/board/${selectedBoardId}/members`);
    } else {
      navigate("/dashboard/boards/members");
    }
  };

  return (
    <div className="fixed top-16 left-0 z-30 flex h-[calc(100vh-4rem)]">
      <div
        className={`h-full bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        } overflow-hidden shadow-xl`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-700 p-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-600 text-xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="truncate text-lg font-semibold">
                  {user ? `${user.username}'s workspace` : "Workspace"}
                </h2>
                <span className="text-xs text-gray-400">Free</span>
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
          <div className="flex-1 space-y-6 overflow-y-auto p-3">
            {/* Main nav */}
            <div className="space-y-1">
              <button
                onClick={() => navigate("/dashboard/boards")}
                className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium ${
                  isActive("/boards")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <FiGrid className="mr-3 h-5 w-5" />
                <span>Boards</span>
              </button>

              <button
                onClick={handleShowMembers}
                className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium ${
                  isActive(`/dashboard/board/${selectedBoardId}/members`)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <FiUsers className="mr-3 h-5 w-5" />
                <span>Members</span>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium ${
                  isActive("/settings")
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                <span>Workspace settings</span>
              </button>
            </div>

            {/* Board list */}
            <div>
              <div className="mb-2 flex items-center justify-between px-4">
                <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Your Boards
                </h3>
                <button
                  onClick={() => navigate("/dashboard/boards")}
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
                  <>
                    {/* MY BOARDS */}
                    {myBoards.length > 0 && (
                      <>
                        <div className="mt-3 mb-1 px-4 text-xs font-semibold text-gray-400 uppercase">
                          MY BOARDS
                        </div>
                        {myBoards.map((board, index) => {
                          const myRole =
                            board.role ||
                            (String(board.createdBy) === String(user?._id)
                              ? "admin"
                              : "member");

                          return (
                            <button
                              key={board._id}
                              onClick={() => {
                                handleSelectBoard(board._id);
                                navigate(`/dashboard/board/${board._id}`);
                              }}
                              className={`group flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                                location.pathname ===
                                `/dashboard/board/${board._id}`
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              <div
                                className={`mr-3 h-5 w-5 rounded ${getBoardColor(index)}`}
                              />
                              <div className="flex flex-1 justify-between truncate">
                                <span>{board.title}</span>
                                <RoleBadge role={myRole} />
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* SHARED BOARDS */}
                    {sharedBoards.length > 0 && (
                      <>
                        <div className="mt-4 mb-1 px-4 text-xs font-semibold text-gray-400 uppercase">
                          SHARED WITH ME
                        </div>
                        {sharedBoards.map((board, index) => {
                          const myRole =
                            board.role ||
                            (String(board.createdBy) === String(user?._id)
                              ? "admin"
                              : "member");

                          return (
                            <button
                              key={board._id}
                              onClick={() => {
                                handleSelectBoard(board._id);
                                navigate(`/dashboard/board/${board._id}`);
                              }}
                              className={`group flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                                location.pathname ===
                                `/dashboard/board/${board._id}`
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              <div
                                className={`mr-3 h-5 w-5 rounded ${getBoardColor(index + 100)}`}
                              />
                              <div className="flex flex-1 justify-between truncate">
                                <span>{board.title}</span>
                                <RoleBadge role={myRole} />
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
