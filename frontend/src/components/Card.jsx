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
      className="card group flex items-center justify-between rounded bg-gray-700 p-2 shadow"
    >
      <div
        {...listeners}
        className="flex basis-[90%] cursor-grab items-center space-x-2 select-none"
      >
        <span className="text-sm text-white">{card.title}</span>
      </div>
      <div className="basis-[10%] cursor-pointer space-x-2">
        <svg
          onClick={() => setIsModalOpen(true)}
          className="hidden h-4 w-4 text-gray-400 transition-opacity duration-300 group-hover:block"
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
