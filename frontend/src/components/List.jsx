import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";
import { useTranslation } from "react-i18next";
import { useDroppable } from "@dnd-kit/core";

const List = ({ list, onAddCard, onEditCard, onDeleteCard, onDeleteList }) => {
  const { t } = useTranslation();

  if (!list) {
    return <div>{t("listNotFound")}</div>;
  }

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `list-${list._id}` || "",
      data: { listId: list._id || "" },
    });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${list._id}`,
    data: { listId: list._id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const addCardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addCardRef.current && !addCardRef.current.contains(event.target)) {
        setIsAddingCard(false);
      }
    };

    if (isAddingCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddingCard]);

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
      className="flex max-h-[calc(100vh-200px)] w-72 min-w-[18rem] flex-col rounded bg-white text-gray-800 shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 {...listeners} className="cursor-grab text-base font-semibold">
          {list.title || "Untitled"}
        </h3>
        <button
          onClick={() => onDeleteList(list._id)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Scroll Cards */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          ref={setDroppableRef}
          className="cards flex-1 space-y-2 overflow-x-hidden overflow-y-auto p-3"
        >
          {list.cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
            />
          ))}
        </div>
      </div>

      {/* Add Card */}
      <div className="border-t px-3 py-2" ref={addCardRef}>
        {isAddingCard ? (
          <>
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="w-full resize-none rounded bg-gray-700 p-2 text-sm text-white"
              placeholder="Enter card title..."
              rows={2}
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={handleAddCardSubmit}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
          >
            <span className="text-lg">＋</span> Add Card
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
