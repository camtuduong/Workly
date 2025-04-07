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

  const cardCount = list.cards.length;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex max-h-[calc(100vh-200px)] w-72 min-w-[18rem] flex-col rounded-lg border border-gray-200 bg-gray-50 text-gray-800 shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-4 py-3">
        <h3
          {...listeners}
          className="cursor-grab text-base font-semibold text-gray-700 select-none"
        >
          {list.title || "Untitled"}

          <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            {cardCount}
          </span>
        </h3>

        <button
          onClick={() => onDeleteList(list._id)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-red-500"
          aria-label="Delete list"
        >
          ×
        </button>
      </div>

      {/* Scroll Cards */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          ref={setDroppableRef}
          className="cards flex-1 space-y-3 overflow-x-hidden overflow-y-auto bg-gray-50 p-3"
        >
          {list.cards.length === 0 && (
            <div className="py-4 text-center text-sm text-gray-400 italic">
              No cards yet
            </div>
          )}
          {list.cards.map((card) => (
            <Card
              key={card._id}
              card={{ ...card, boardId: list.boardId }}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
            />
          ))}
        </div>
      </div>

      {/* Add Card */}
      <div
        className="rounded-b-lg border-t border-gray-200 bg-white px-3 py-3"
        ref={addCardRef}
      >
        {isAddingCard ? (
          <>
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="w-full resize-none rounded border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter card title..."
              rows={2}
              autoFocus
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAddCardSubmit}
                className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="rounded px-3 py-1.5 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center justify-center gap-1 rounded py-1.5 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100"
          >
            <span className="text-lg">＋</span> Add Card
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
