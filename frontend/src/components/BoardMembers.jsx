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
  const [newMemberEmail, setNewMemberEmail] = useState("");
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
      if (!newMemberEmail) {
        alert("Please enter a valid email");
        return;
      }

      await addMember(boardId, newMemberEmail, role);

      setNewMemberEmail("");
      alert("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <div className="mr-2 h-6 w-1 rounded-full bg-blue-500"></div>
        <h1 className="text-2xl font-bold text-gray-800">Board Members</h1>
      </div>

      {/* Form thêm thành viên */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">
          Add New Member
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="min-w-[240px] flex-grow">
            <input
              type="email"
              placeholder="Enter member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-md border border-gray-300 bg-white p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleAddMember}
              className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Member
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-700">
            Current Members
          </h2>
          {members.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No members found</p>
          ) : (
            <ul className="space-y-3">
              {members.map((member) => (
                <li
                  key={member.userId}
                  className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-medium text-white">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {member.username}
                        </p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.userId, e.target.value)
                        }
                        className="appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      className="flex items-center rounded-md px-2 py-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardMembers;
