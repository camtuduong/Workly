import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Drawer from "../components/Drawer";
import List from "../components/List";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getBoard, deleteBoard } from "../api/boardApi";
import { createList, deleteList, updateListPosition } from "../api/listApi";
import {
  createCard,
  updateCard,
  deleteCard,
  updateCardPosition,
} from "../api/cardApi";
import { getAllUsers } from "../api/userApi";
import { SOCKET_URL } from "../api/config";
import { useTranslation } from "react-i18next";

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showUserPanel, setShowUserPanel] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
      newSocket.emit("joinBoard", id);

      const userId = localStorage.getItem("userId");
      if (userId) {
        newSocket.emit("setUserId", userId);
      }
    });

    newSocket.on("boardUpdated", (updatedBoard) => {
      console.log("Board updated:", updatedBoard);
      if (updatedBoard && updatedBoard._id === id && updatedBoard.lists) {
        updatedBoard.lists = updatedBoard.lists.map((list) => ({
          ...list,
          cards: list.cards || [],
        }));
        setBoard(updatedBoard);
      } else {
        console.error("Invalid board data received:", updatedBoard);
      }
    });

    newSocket.on("boardDeleted", (boardId) => {
      console.log("Board deleted:", boardId);
      if (boardId === id) {
        navigate("/boards");
      }
    });

    newSocket.on("userRegistered", (newUser) => {
      console.log("New user registered:", newUser);
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    newSocket.on("userUpdated", (updatedUser) => {
      console.log("User updated:", updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser.userId
            ? { ...user, language: updatedUser.language }
            : user,
        ),
      );
    });

    newSocket.on("userOnline", ({ userId }) => {
      console.log(`User ${userId} is online`);
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    newSocket.on("userOffline", ({ userId }) => {
      console.log(`User ${userId} is offline`);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      if (newSocket.connected) {
        newSocket.emit("leaveBoard", id);
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [id, navigate]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoard(id);
        setBoard(data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(t("boardNotFound"));
        } else {
          setError(t("errorFetchingBoard"));
        }
        console.error("Error fetching board:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, t]);

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;

    try {
      await createList(id, newListTitle);
      setNewListTitle("");
      setIsAddingList(false);
    } catch (error) {
      console.error("Error creating list:", error.message);
    }
  };

  const handleAddCard = async (listId, title, description) => {
    try {
      const response = await createCard(listId, title, description);
      console.log("Card created:", response);
    } catch (error) {
      console.error("Error creating card:", error.message);
    }
  };

  const handleEditCard = async (cardId, title, description) => {
    try {
      await updateCard(cardId, title, description);
    } catch (error) {
      console.error("Error updating card:", error.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
    } catch (error) {
      console.error("Error deleting card:", error.message);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const response = await deleteList(listId);
      console.log("List deleted successfully:", response);
      socket.emit("listDeleted", listId);
    } catch (error) {
      console.error(
        "Error deleting list:",
        error.response?.data || error.message,
      );
      alert(
        "Failed to delete list: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm(t("confirmDeleteBoard"))) return;

    try {
      await deleteBoard(id);
      socket.emit("boardDeleted", id);
      navigate("/dashboard/boards");
    } catch (error) {
      console.error("Error deleting board:", error.message);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    // Xử lý kéo thả list
    if (active.id.includes("list")) {
      console.log("Dragging list:", active.id);
      const activeListId = active.id.replace("list-", "");
      const overListId = over.id.replace("list-", "");

      const oldIndex = board.lists.findIndex(
        (list) => list._id === activeListId,
      );
      const newIndex = board.lists.findIndex((list) => list._id === overListId);

      if (oldIndex === -1 || newIndex === -1) {
        console.error("List not found:", { oldIndex, newIndex });
        return;
      }

      const newLists = arrayMove(board.lists, oldIndex, newIndex);
      const updatedBoard = { ...board, lists: newLists };
      setBoard(updatedBoard);

      try {
        await updateListPosition(activeListId, newIndex);
      } catch (error) {
        console.error("Error updating list position:", error.message);
        setBoard(board);
      }
      return;
    }

    // Xử lý kéo thả card
    const activeListId = active.data.current?.listId;
    const overListId =
      over.data.current?.listId || over.id.replace("droppable-", "");
    const activeCardId = active.id.replace("card-", "");

    if (!activeListId || !overListId) {
      console.error("Invalid list IDs:", { activeListId, overListId });
      return;
    }

    const activeListIndex = board.lists.findIndex(
      (list) => list._id === activeListId,
    );
    const overListIndex = board.lists.findIndex(
      (list) => list._id === overListId,
    );

    if (activeListIndex === -1 || overListIndex === -1) {
      console.error("List not found:", { activeListIndex, overListIndex });
      return;
    }

    const activeCard = board.lists[activeListIndex].cards.find(
      (card) => card._id === activeCardId,
    );
    if (!activeCard) {
      console.error("Active card not found:", activeCardId);
      const updatedBoard = await getBoard(id);
      setBoard(updatedBoard);
      return;
    }

    if (activeListId === overListId) {
      const activeListCards = board.lists[activeListIndex].cards;
      const oldIndex = activeListCards.findIndex(
        (card) => card._id === activeCardId,
      );

      let newIndex;
      const overCard = activeListCards.find(
        (card) => card._id === over.id.replace("card-", ""),
      );
      if (overCard) {
        newIndex = activeListCards.findIndex(
          (card) => card._id === over.id.replace("card-", ""),
        );
      } else {
        newIndex = activeListCards.length - 1;
      }

      if (oldIndex === -1 || newIndex === -1) {
        console.error("Card not found:", { oldIndex, newIndex });
        return;
      }

      const newCards = arrayMove(activeListCards, oldIndex, newIndex);
      const newLists = [...board.lists];
      newLists[activeListIndex].cards = newCards;
      const updatedBoard = { ...board, lists: newLists };
      setBoard(updatedBoard);

      try {
        await updateCardPosition({
          cardId: activeCardId,
          newListId: activeListId,
          newPosition: newIndex,
        });
      } catch (error) {
        console.error("Error updating card position:", error.message);
        const updatedBoard = await getBoard(id);
        setBoard(updatedBoard);
      }
    } else {
      const newLists = [...board.lists];
      newLists[activeListIndex].cards = newLists[activeListIndex].cards.filter(
        (card) => card._id !== activeCardId,
      );

      const overListCards = newLists[overListIndex].cards;
      const overCard = overListCards.find(
        (card) => card._id === over.id.replace("card-", ""),
      );
      let newPosition;
      if (overCard) {
        newPosition = overListCards.findIndex(
          (card) => card._id === over.id.replace("card-", ""),
        );
        newLists[overListIndex].cards.splice(newPosition, 0, activeCard);
      } else {
        newPosition = overListCards.length;
        newLists[overListIndex].cards.push(activeCard);
      }

      const updatedBoard = { ...board, lists: newLists };
      setBoard(updatedBoard);

      try {
        await updateCardPosition({
          cardId: activeCardId,
          newListId: overListId,
          newPosition: newPosition,
        });
      } catch (error) {
        console.error("Error updating card position:", error.message);
        // Fetch lại board từ backend để đồng bộ dữ liệu
        const updatedBoard = await getBoard(id);
        setBoard(updatedBoard);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-white">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="rounded-lg bg-red-500/10 p-8 text-center shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-white">{error}</h2>
          <button
            onClick={() => navigate("/dashboard/boards")}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
          >
            {t("backToBoards")}
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="rounded-lg bg-gray-800 p-8 text-center shadow-lg">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-white">
            {t("boardNotFound")}
          </h2>
          <button
            onClick={() => navigate("/dashboard/boards")}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
          >
            {t("backToBoards")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black/30 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard/boards")}
            className="rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">{board.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUserPanel(!showUserPanel)}
            className="flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-white transition-all hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            {onlineUsers.length} {t("online")}
          </button>

          <button
            onClick={handleDeleteBoard}
            className="flex items-center rounded-lg bg-red-500/80 px-3 py-1.5 text-white transition-all hover:bg-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {t("deleteBoard")}
          </button>
        </div>
      </div>

      {/* Online Users Panel */}
      {showUserPanel && (
        <div className="absolute top-16 right-6 z-10 w-64 rounded-lg bg-gray-800 p-4 shadow-lg">
          <h3 className="mb-2 border-b border-gray-700 pb-2 text-lg font-medium text-white">
            {t("onlineUsers")}
          </h3>
          <ul className="max-h-60 overflow-y-auto">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((userId) => {
                const user = users.find((u) => u._id === userId);
                return (
                  <li
                    key={userId}
                    className="mb-2 flex items-center text-white"
                  >
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    {user ? user.username : userId}
                  </li>
                );
              })
            ) : (
              <li className="text-gray-400">{t("noOnlineUsers")}</li>
            )}
          </ul>
        </div>
      )}

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 pt-2 pb-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex min-w-max items-start gap-4">
            <SortableContext
              items={board.lists.map((list) => `list-${list._id}`)}
              strategy={horizontalListSortingStrategy}
            >
              {board.lists.map((list) => (
                <List
                  key={list._id}
                  list={list}
                  onAddCard={handleAddCard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                  onDeleteList={handleDeleteList}
                />
              ))}
            </SortableContext>

            {isAddingList ? (
              <div className="flex h-auto w-72 flex-col rounded-lg bg-gray-800/90 p-3 shadow-lg backdrop-blur-sm">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="mb-3 w-full rounded-md border border-gray-600 bg-gray-700/90 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder={t("enterListTitle")}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddList}
                    className="flex-1 rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {t("addList")}
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className="rounded-md bg-gray-700 px-3 py-2 text-gray-300 transition-colors hover:bg-gray-600"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="flex h-16 w-72 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("addList")}
              </button>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;
