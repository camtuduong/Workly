import { useState } from "react";
import { addMember } from "../api/boardApi";

const AddMemberForm = ({ boardId }) => {
  const [memberId, setMemberId] = useState("");

  const handleAddMember = async () => {
    try {
      await addMember(boardId, memberId);
      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member.");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Enter user ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="mb-2 w-full rounded p-2"
      />
      <button
        onClick={handleAddMember}
        className="rounded bg-green-500 p-2 text-white"
      >
        Add Member
      </button>
    </div>
  );
};

export default AddMemberForm;
