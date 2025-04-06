import apiClient from "./config";

export const getBoards = async () => {
  const response = await apiClient.get("/boards");
  return response.data;
};

export const getBoard = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}`);
  return response.data;
};

export const createBoard = async (title) => {
  try {
    const response = await apiClient.post("/boards", { title });
    return response.data; // Trả về dữ liệu board mới
  } catch (error) {
    console.error("Error creating board:", error.message);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

export const updateBoard = async (boardId, title) => {
  const response = await apiClient.put(`/boards/${boardId}`, { title });
  return response.data;
};

export const deleteBoard = async (boardId) => {
  const response = await apiClient.delete(`/boards/${boardId}`);
  return response.data;
};

// members
export const getBoardMembers = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}/members`);
  return response.data;
};

export const addMember = async (boardId, memberId) => {
  const response = await apiClient.put(`/boards/${boardId}/members`, {
    memberId,
  });
  return response.data;
};

export const removeMember = async (boardId, memberId) => {
  const response = await apiClient.put(`/boards/${boardId}/members/remove`, {
    memberId,
  });
  return response.data;
};
