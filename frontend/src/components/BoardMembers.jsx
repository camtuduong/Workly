import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBoardMembers } from "../api/boardApi"; // Giả sử bạn đã tạo API này

const BoardMembers = () => {
  const { boardId } = useParams(); // Nhận boardId từ URL
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        if (boardId) {
          // Nếu có boardId, lấy thành viên của board cụ thể
          const data = await getBoardMembers(boardId);
          setMembers(data);
        } else {
          // Nếu không có boardId, lấy thành viên của tất cả boards
          const data = await getAllMembers(); // Giả sử API này sẽ trả về thành viên của tất cả boards
          setMembers(data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [boardId]); // Khi boardId thay đổi, sẽ gọi lại API

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        {boardId ? "Members of the board" : "Members of all boards"}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li
              key={member._id}
              className="mb-2 flex items-center justify-between rounded bg-gray-300 p-2"
            >
              <span>{member.username}</span>
              <button
                onClick={() => handleRemoveMember(member._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardMembers;
