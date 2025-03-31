import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";
import { useTranslation } from "react-i18next";

const List = ({ list, onAddCard, onEditCard, onDeleteCard, onDeleteList }) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: list._id,
      data: { listId: list._id },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCardSubmit = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(list._id, newCardTitle);
    setNewCardTitle("");
    setIsAddingCard(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list w-64 rounded bg-gray-100 p-4 shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{list.title}</h3>
        <button
          onClick={() => onDeleteList(list._id)}
          className="text-red-500 hover:text-red-700"
        >
          {t("delete")}
        </button>
      </div>
      <div className="cards space-y-2">
        {list.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      {isAddingCard ? (
        <div className="mt-4">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="mb-2 w-full rounded border p-2"
            placeholder={t("enterCardTitle")}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddCardSubmit}
              className="rounded bg-blue-500 px-4 py-1 text-white"
            >
              {t("addCard")}
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="mt-4 text-blue-500 hover:text-blue-700"
        >
          {t("addCard")}
        </button>
      )}
    </div>
  );
};

export default List;
