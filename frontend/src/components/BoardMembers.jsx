import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getBoardMembers,
  removeMember,
  updateMemberRole,
  addMember,
} from "../api/boardApi"; // Giả sử bạn đã tạo API này

const BoardMembers = () => {
  const { boardId } = useParams(); // Nhận boardId từ URL
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberId, setNewMemberId] = useState(""); // Để lưu ID của thành viên mới
  const [role, setRole] = useState("member"); // Role của thành viên mới

  // Lấy danh sách thành viên của board
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const data = await getBoardMembers(boardId);
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [boardId]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateMemberRole(boardId, userId, newRole);
      setMembers(
        members.map((member) =>
          member.userId === userId ? { ...member, role: newRole } : member,
        ),
      );
      alert("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(boardId, userId);
      setMembers(members.filter((member) => member.userId !== userId));
      alert("Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
  };

  const handleAddMember = async () => {
    try {
      if (!newMemberId) {
        alert("Please enter a valid member ID");
        return;
      }

      const newMember = await addMember(boardId, newMemberId, role);
      setMembers([...members, newMember]); // Thêm thành viên mới vào danh sách
      setNewMemberId(""); // Reset input field
      alert("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Members of the board</h1>

      {/* Form thêm thành viên */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter member ID"
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
          className="rounded border p-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="ml-2 rounded border p-2"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          onClick={handleAddMember}
          className="ml-2 rounded bg-blue-500 p-2 text-white"
        >
          Add Member
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li
              key={member.userId}
              className="mb-2 flex items-center justify-between rounded bg-gray-300 p-2"
            >
              <span>{member.userId}</span>

              <select
                value={member.role}
                onChange={(e) =>
                  handleUpdateRole(member.userId, e.target.value)
                }
                className="rounded bg-gray-200 p-1"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                onClick={() => handleRemoveMember(member.userId)}
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
