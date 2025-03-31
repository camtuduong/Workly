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

// Phần còn lại của code giữ nguyên
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

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    newSocket.on("boardUpdated", (updatedBoard) => {
      console.log("Board updated:", updatedBoard);
      setBoard(updatedBoard);
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

  const handleAddCard = async (listId, title) => {
    try {
      await createCard(listId, title);
    } catch (error) {
      console.error("Error creating card:", error.message);
    }
  };

  const handleEditCard = async (cardId, title) => {
    try {
      await updateCard(cardId, title);
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
      await deleteList(listId);
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(id);
    } catch (error) {
      console.error("Error deleting board:", error.message);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id.includes("list")) {
      const oldIndex = board.lists.findIndex((list) => list._id === active.id);
      const newIndex = board.lists.findIndex((list) => list._id === over.id);

      try {
        await updateListPosition(active.id, newIndex);
      } catch (error) {
        console.error("Error updating list position:", error.message);
      }
      return;
    }

    const activeListId = active.data.current.listId;
    const overListId = over.data.current?.listId || over.id;
    const activeCardId = active.id;

    const activeListIndex = board.lists.findIndex(
      (list) => list._id === activeListId,
    );
    const overListIndex = board.lists.findIndex(
      (list) => list._id === overListId,
    );

    if (activeListId === overListId) {
      const oldIndex = board.lists[activeListIndex].cards.findIndex(
        (card) => card._id === activeCardId,
      );
      const newIndex = board.lists[activeListIndex].cards.findIndex(
        (card) => card._id === over.id,
      );
      const newCards = arrayMove(
        board.lists[activeListIndex].cards,
        oldIndex,
        newIndex,
      );
      const newLists = [...board.lists];
      newLists[activeListIndex].cards = newCards;
      const updatedBoard = { ...board, lists: newLists };
      setBoard(updatedBoard);

      try {
        await updateCardPosition(activeCardId, activeListId, newIndex);
      } catch (error) {
        console.error("Error updating card position:", error.message);
        setBoard(board);
      }
    } else {
      const card = board.lists[activeListIndex].cards.find(
        (card) => card._id === activeCardId,
      );
      const newLists = [...board.lists];
      newLists[activeListIndex].cards = newLists[activeListIndex].cards.filter(
        (card) => card._id !== activeCardId,
      );
      newLists[overListIndex].cards.push(card);
      const updatedBoard = { ...board, lists: newLists };
      setBoard(updatedBoard);

      try {
        await updateCardPosition(
          activeCardId,
          overListId,
          newLists[overListIndex].cards.length - 1,
        );
      } catch (error) {
        console.error("Error updating card position:", error.message);
        setBoard(board);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {error}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {t("boardNotFound")}
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Drawer />
      <div className="flex-1 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{board.title}</h1>
          <button
            onClick={handleDeleteBoard}
            className="rounded bg-red-500 px-4 py-1 text-white"
          >
            {t("deleteBoard")}
          </button>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            {t("onlineUsers")}
          </h2>
          <ul>
            {onlineUsers.map((userId) => {
              const user = users.find((u) => u._id === userId);
              return (
                <li key={userId} className="text-white">
                  {user ? user.username : userId} ({t("online")})
                </li>
              );
            })}
          </ul>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4">
            <SortableContext
              items={board.lists.map((list) => list._id)}
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
              <div className="w-64 rounded bg-gray-200 p-4">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="mb-2 w-full rounded border p-2"
                  placeholder={t("enterListTitle")}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddList}
                    className="rounded bg-blue-500 px-4 py-1 text-white"
                  >
                    {t("addList")}
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-64 rounded bg-gray-200 p-4"
              >
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
