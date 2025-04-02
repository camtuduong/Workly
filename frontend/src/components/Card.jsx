import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

const Card = ({ card, onEditCard, onDeleteCard }) => {
  const { t } = useTranslation();

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

        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditCard();
          }}
          className="text-blue-400 hover:text-blue-300"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-1.414-1.414a2 2 0 010-2.828z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCard(card._id);
          }}
          className="text-red-400 hover:text-red-300"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export default Card;
