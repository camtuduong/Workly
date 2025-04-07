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
import {
  FiUserPlus,
  FiUsers,
  FiTrash2,
  FiMail,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiShield,
  FiEye,
  FiUser,
} from "react-icons/fi";

const RoleBadge = ({ role }) => {
  let icon, color;

  switch (role) {
    case "admin":
      icon = <FiShield className="mr-1 h-3 w-3" />;
      color =
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300";
      break;
    case "viewer":
      icon = <FiEye className="mr-1 h-3 w-3" />;
      color =
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
      break;
    default: // member
      icon = <FiUser className="mr-1 h-3 w-3" />;
      color =
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${color}`}
    >
      {icon}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const BoardMembers = () => {
  const { boardId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [role, setRole] = useState("member");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchMembers();
  }, [boardId]);

  useEffect(() => {
    const socketIo = io(SOCKET_URL);
    socketIo.emit("joinBoard", boardId);

    socketIo.on("membersChanged", () => {
      fetchMembers();
    });

    return () => {
      socketIo.emit("leaveBoard", boardId);
      socketIo.disconnect();
    };
  }, [boardId]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getBoardMembers(boardId);
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      showNotification("Failed to load members", "error");
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
      showNotification("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      showNotification("Failed to update role", "error");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeMember(boardId, userId);
      setMembers(members.filter((member) => member.userId !== userId));
      showNotification("Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      showNotification("Failed to remove member", "error");
    }
  };

  const handleAddMember = async () => {
    try {
      if (!newMemberEmail) {
        showNotification("Please enter a valid email", "error");
        return;
      }

      await addMember(boardId, newMemberEmail, role);
      setNewMemberEmail("");
      showNotification("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      showNotification("Failed to add member", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 dark:bg-gradient-to-br dark:from-[#1E1331] dark:to-[#2D1B4A] dark:text-white">
      {/* Custom Scrollbar Styling */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #6b7280;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: #2D1B4A;
          }
        `}
      </style>

      {/* Notification Toast */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center rounded-lg p-4 shadow-lg ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {notification.type === "error" ? (
            <FiAlertCircle className="mr-2 h-5 w-5" />
          ) : (
            <FiCheck className="mr-2 h-5 w-5" />
          )}
          <span>{notification.message}</span>
          <button
            className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-md">
            <FiUsers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Board Members
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage access and permissions for your board
            </p>
          </div>
        </div>

        {/* Form thêm thành viên */}
        <div className="mb-8 overflow-hidden rounded-xl p-6 shadow-xl backdrop-blur-sm dark:bg-[#2A1F42]/60">
          <div className="border-b border-gray-200/20 p-4">
            <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
              <FiUserPlus className="mr-2 h-5 w-5 text-purple-400 dark:text-purple-400" />
              Add New Member
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              <div className="min-w-[240px] flex-grow">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter member email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="focus:ring-opacity-30 w-full rounded-lg border border-purple-500/30 bg-[#3A2F52] p-3 pl-10 text-white placeholder-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-opacity-30 h-full rounded-lg border border-purple-500/30 bg-[#3A2F52] p-3 text-white placeholder-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <button
                  onClick={handleAddMember}
                  className="focus:ring-opacity-50 flex h-full items-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-white shadow-md transition-all hover:shadow-purple-500/25 active:scale-95"
                >
                  <FiUserPlus className="mr-2 h-5 w-5" />
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl bg-[#2A1F42]/60 p-12 shadow-xl backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading members...
            </span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-[#2A1F42]/60 shadow-xl backdrop-blur-sm">
            <div className="border-b border-gray-200/20 p-4">
              <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                <FiUsers className="mr-2 h-5 w-5 text-purple-400 dark:text-purple-400" />
                Current Members
                <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {members.length}
                </span>
              </h2>
            </div>

            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 rounded-full bg-purple-500/20 p-4">
                  <FiUsers className="h-8 w-8 text-purple-300" />
                </div>
                <p className="mb-2 text-lg font-medium text-purple-300">
                  No members found
                </p>
                <p className="text-purple-300/70">
                  Add members to collaborate on this board
                </p>
              </div>
            ) : (
              <div className="custom-scrollbar max-h-[200px] overflow-y-auto">
                <ul className="divide-y divide-gray-200/20">
                  {members.map((member) => (
                    <li
                      key={member.userId}
                      className="p-4 transition-colors hover:bg-gray-700/30"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-lg font-medium text-white shadow-sm">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {member.username}
                            </p>
                            <p className="text-sm text-gray-400">
                              {member.email}
                            </p>
                            <div className="mt-1">
                              <RoleBadge role={member.role} />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleUpdateRole(member.userId, e.target.value)
                              }
                              className="focus:ring-opacity-30 rounded-lg border border-purple-500/30 bg-[#3A2F52] px-4 py-2 pr-10 text-sm text-white placeholder-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleRemoveMember(member.userId)}
                            className="flex items-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white shadow-lg transition-all hover:shadow-red-500/25 active:scale-95"
                          >
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardMembers;
