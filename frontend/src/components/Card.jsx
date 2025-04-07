import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardDetailModal from "./CardDetailModal";

const Card = ({ card, onEditCard, onDeleteCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `card-${card._id}`,
      data: { cardId: card._id, listId: card.listId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="card group mb-2 flex items-center justify-between rounded-md border border-gray-700 bg-gray-800 p-3 shadow-md transition-all duration-200 hover:shadow-lg"
    >
      <div
        {...listeners}
        className="flex basis-[90%] cursor-grab items-center space-x-2 select-none"
      >
        <span className="text-sm font-medium text-gray-200">{card.title}</span>
      </div>
      <div className="flex basis-[10%] cursor-pointer justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-700 hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {isModalOpen && (
        <CardDetailModal
          card={card}
          onClose={() => setIsModalOpen(false)}
          onEditCard={onEditCard}
        />
      )}
    </div>
  );
};

export default Card;
