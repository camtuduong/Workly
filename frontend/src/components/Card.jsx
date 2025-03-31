import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Card = ({ card, onEditCard, onDeleteCard }) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card._id,
      data: { listId: card.listId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  const handleEditSubmit = () => {
    if (!editTitle.trim()) return;
    onEditCard(card._id, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card flex items-center justify-between rounded bg-white p-2 shadow"
    >
      {isEditing ? (
        <div className="flex w-full flex-col space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded border p-1"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleEditSubmit}
              className="rounded bg-blue-500 px-2 py-1 text-white"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link to={`/card/${card._id}`}>
            <span className="hover:underline">{card.title}</span>
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-500 hover:text-yellow-700"
            >
              {t("edit")}
            </button>
            <button
              onClick={() => onDeleteCard(card._id)}
              className="text-red-500 hover:text-red-700"
            >
              {t("delete")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
