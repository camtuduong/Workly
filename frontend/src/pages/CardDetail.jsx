import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCard, updateCard, deleteCard } from "../api/cardApi";
import { useTranslation } from "react-i18next";

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await getCard(id);
        setCard(data);
        setEditTitle(data.title);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(t("cardNotFound"));
        } else {
          setError(t("errorFetchingCard"));
        }
        console.error("Error fetching card:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, t]);

  const handleUpdateCard = async () => {
    if (!editTitle.trim()) return;
    try {
      await updateCard(id, editTitle);
      setCard({ ...card, title: editTitle });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating card:", error.message);
    }
  };

  const handleDeleteCard = async () => {
    try {
      await deleteCard(id);
      navigate(`/board/${card.boardId}`); // Chuyển hướng về board sau khi xóa
    } catch (error) {
      console.error("Error deleting card:", error.message);
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

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        {t("cardNotFound")}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1E1331] p-6">
      <div className="flex-1 rounded-lg bg-[#2A1F42] p-6 text-white">
        <div className="mb-6 flex items-center justify-between">
          {isEditing ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded border bg-[#3A2F52] p-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={handleUpdateCard}
                className="rounded bg-blue-500 px-4 py-1 text-white"
              >
                {t("save")}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                {t("cancel")}
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{card.title}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded bg-yellow-500 px-4 py-1 text-white"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={handleDeleteCard}
                  className="rounded bg-red-500 px-4 py-1 text-white"
                >
                  {t("delete")}
                </button>
              </div>
            </>
          )}
        </div>
        <p>{t("cardDetails")}</p>
        {/* Thêm các thông tin khác của card nếu cần (mô tả, người được gán, v.v.) */}
      </div>
    </div>
  );
};

export default CardDetail;
