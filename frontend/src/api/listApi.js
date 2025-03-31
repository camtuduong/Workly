import apiClient from "./config";

const LIST_API = "/lists";

export const createList = async (boardId, title) => {
  const response = await apiClient.post(`${LIST_API}`, { boardId, title });
  return response.data;
};

export const deleteList = async (listId) => {
  const response = await apiClient.delete(`${LIST_API}/${listId}`);
  return response.data;
};

export const updateListPosition = async (listId, newPosition) => {
  const response = await apiClient.put(`${LIST_API}/position`, {
    listId,
    newPosition,
  });
  return response.data;
};
