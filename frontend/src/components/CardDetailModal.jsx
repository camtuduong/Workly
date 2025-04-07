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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-800">
            <span className="mr-2 h-6 w-1 rounded-full bg-blue-500"></span>
            Chi tiết thẻ
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề"
              className="w-full rounded-md border border-gray-300 p-2 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết..."
              className="w-full rounded-md border border-gray-300 p-2 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Người phụ trách
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Chọn --</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.username} ({m.role})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tệp đính kèm
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-md border border-blue-300 bg-white px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50">
                <span>Chọn tệp</span>
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.files[0]?.name);
                  }}
                  className="hidden"
                />
              </label>
              {fileName && (
                <span className="flex items-center text-sm text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  {fileName}
                </span>
              )}
            </div>
          </div>

          {/* Hiển thị các file đã đính kèm */}
          {attachments.length > 0 && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Đã đính kèm:
              </label>
              <ul className="space-y-1">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <a
                      href={`http://localhost:7000${file.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                    >
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
            <button
              onClick={handleDeleteCard}
              className="flex items-center rounded-md px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Xoá thẻ
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-300"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveCard}
                disabled={loading}
                className={`flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lưu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
