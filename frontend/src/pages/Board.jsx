import React from "react";
import { useTranslation } from "react-i18next";
import Drawer from "../components/Drawer";

const Board = () => {
  const { t } = useTranslation();

  // Dữ liệu giả lập cho danh sách và thẻ
  const lists = [
    { id: "1", title: "To Do", cards: [] },
    { id: "2", title: "Doing", cards: [{ id: "c1", title: "lk" }] },
  ];

  return (
    <div className="flex">
      <Drawer />
      <div className="flex-1 p-4">
        <h1 className="mb-4 text-2xl font-bold">{t("board.title")}</h1>
        <div className="flex space-x-4">
          {lists.map((list) => (
            <div key={list.id} className="w-64 rounded bg-gray-100 p-4">
              <h3 className="font-bold">{list.title}</h3>
              {list.cards.map((card) => (
                <div key={card.id} className="mb-2 rounded bg-white p-2 shadow">
                  {card.title}
                </div>
              ))}
              <button className="mt-2 text-sm text-gray-600">
                {t("board.addCard")}
              </button>
            </div>
          ))}
          <button className="w-64 rounded bg-gray-200 p-4">
            {t("board.addList")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
