import React, { useState, useEffect } from "react";
import { updateCard, deleteCard, uploadCardFile } from "../api/cardApi";
import { getBoardMembers } from "../api/boardApi";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/config";

const CardDetailModal = ({ card, onClose, onEditCard }) => {
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [assignedTo, setAssignedTo] = useState(card.assignedTo || "");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [attachments, setAttachments] = useState(card.attachments || []);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
    setAssignedTo(card.assignedTo || "");
    setAttachments(card.attachments || []);

    const fetchMembers = async () => {
      try {
        const data = await getBoardMembers(card.boardId);
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    if (card.boardId) fetchMembers();
  }, [card]);

  const emitBoardUpdated = () => {
    const socket = io(SOCKET_URL);
    socket.emit("boardUpdated", {
      boardId: card.boardId,
      message: "Card updated",
    });
    socket.disconnect();
  };

  const handleSaveCard = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title và Description không được để trống.");
      return;
    }

    setLoading(true);
    try {
      const updatedCard = { title, description, assignedTo };
      await updateCard(card._id, updatedCard);

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadCardFile(card._id, formData);
        setAttachments(result.attachments || []);
        setFileName(file.name);
      }

      emitBoardUpdated();

      onEditCard({ ...card, ...updatedCard, attachments });
      onClose();
    } catch (error) {
      console.error("Error saving card:", error.message);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá thẻ này?")) return;
    try {
      await deleteCard(card._id);
      emitBoardUpdated();
      onEditCard({ deleted: true, _id: card._id });
      onClose();
    } catch (error) {
      console.error("Error deleting card:", error.message);
      alert("Xoá thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Chi tiết thẻ
        </h2>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="w-full rounded border p-2"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết..."
            className="w-full rounded border p-2"
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium">Người phụ trách</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            >
              <option value="">-- Chọn --</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.username} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tệp đính kèm</label>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileName(e.target.files[0]?.name);
              }}
              className="mt-1"
            />
            {fileName && (
              <p className="mt-1 text-sm text-green-600">📎 {fileName}</p>
            )}
          </div>

          {/* Hiển thị các file đã đính kèm */}
          {attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium">Đã đính kèm:</label>
              <ul className="list-disc pl-5 text-sm text-blue-700">
                {attachments.map((file, index) => (
                  <li key={index}>
                    <a
                      href={`http://localhost:7000${file.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex justify-between border-t pt-4">
            <button
              onClick={handleDeleteCard}
              className="text-sm text-red-500 hover:underline"
            >
              🗑️ Xoá thẻ
            </button>

            <div className="flex space-x-2">
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
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
