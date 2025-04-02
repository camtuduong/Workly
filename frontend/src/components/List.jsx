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
  const addCardRef = useRef(null); // Ref để tham chiếu đến vùng add card

  // Hàm xử lý khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addCardRef.current && !addCardRef.current.contains(event.target)) {
        setIsAddingCard(false); // Ẩn textarea khi click ngoài
      }
    };

    // Gắn sự kiện click vào document khi textarea hiển thị
    if (isAddingCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Dọn dẹp sự kiện
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
      className="list min-w-72 grow flex-col rounded bg-white text-gray-800 shadow"
    >
      {/* Phần tiêu đề (Title) */}
      <div className="title flex items-center justify-between px-3 py-2">
        <h3
          {...listeners}
          className="basis-[90%] cursor-grab text-base font-semibold"
        >
          {list.title || t("untitledList")}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete button clicked at:", new Date().toISOString());
            console.log("Calling onDeleteList with listId:", list._id);
            onDeleteList(list._id);
          }}
          className="basis-[10%] cursor-pointer text-right text-gray-400 hover:text-gray-200"
        >
          <svg
            className="h-5 w-5"
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
        </button>
      </div>

      {/* Phần danh sách card (Cards) */}
      <div ref={setDroppableRef} className="cards flex-col space-y-2 p-3">
        {list.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>

      {/* Phần thêm card (Add Card) */}
      <div className="add-card mt-auto px-3 py-2" ref={addCardRef}>
        {isAddingCard ? (
          <div>
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="w-full resize-none rounded border bg-gray-700 p-2 text-sm text-white placeholder-gray-400"
              placeholder={t("enterCardTitle")}
              rows={3}
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleAddCardSubmit}
                className="px-3A rounded bg-green-500 py-1 text-sm text-white hover:bg-green-600"
              >
                {t("addCard")}
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
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
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center space-x-2 rounded px-2 py-1 text-sm text-gray-400 hover:bg-gray-700"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{t("addCard")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default List;
