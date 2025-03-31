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
  const response = await apiClient.post("/boards", { title });
  return response.data;
};

export const updateBoard = async (boardId, title) => {
  const response = await apiClient.put(`/boards/${boardId}`, { title });
  return response.data;
};

export const deleteBoard = async (boardId) => {
  const response = await apiClient.delete(`/boards/${boardId}`);
  return response.data;
};
