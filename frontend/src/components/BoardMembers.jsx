import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getBoardMembers,
  removeMember,
  updateMemberRole,
  addMember,
} from "../api/boardApi";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/config";

const BoardMembers = () => {
  const { boardId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberId, setNewMemberId] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    fetchMembers();
  }, [boardId]);

  useEffect(() => {
    const socketIo = io(SOCKET_URL);
    socketIo.emit("joinBoard", boardId);

    socketIo.on("membersChanged", () => {
      fetchMembers(); // reload khi có thay đổi từ socket
    });

    return () => {
      socketIo.emit("leaveBoard", boardId);
      socketIo.disconnect();
    };
  }, [boardId]);
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
      setMembers([...members, newMember]);
      setNewMemberId("");
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
              className="mb-2 flex flex-col rounded bg-gray-300 p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{member.username}</p>
                  <p className="text-sm text-gray-700">{member.email}</p>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BoardMembers;
