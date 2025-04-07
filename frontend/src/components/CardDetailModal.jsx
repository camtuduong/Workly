import React, { useState, useEffect } from "react";
import { updateCard } from "../api/cardApi";
import { getBoardMembers } from "../api/boardApi";

const CardDetailModal = ({ card, onClose, onEditCard }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [assignedTo, setAssignedTo] = useState(card.assignedTo || "");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
    setAssignedTo(card.assignedTo || "");

    const fetchMembers = async () => {
      try {
        const data = await getBoardMembers(card.boardId);
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    if (card.boardId) {
      fetchMembers();
    }
  }, [card]);

  const handleSaveCard = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title và Description không được để trống.");
      return;
    }

    setLoading(true);
    try {
      const updatedCard = { title, description, assignedTo };
      await updateCard(card._id, updatedCard);
      onEditCard(updatedCard);
      onClose();
    } catch (error) {
      console.error("Error saving card:", error.message);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold">Card Detail</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-2 w-full rounded border p-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-2 w-full rounded border p-2"
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">-- Chọn người phụ trách --</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.username} ({m.role})
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-sm"
          >
            Đóng
          </button>
          <button
            onClick={handleSaveCard}
            disabled={loading}
            className={`rounded bg-blue-600 px-4 py-2 text-sm text-white ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Saving..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
