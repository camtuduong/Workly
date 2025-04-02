import apiClient from "./config";

export const createCard = async (listId, title) => {
  const response = await apiClient.post("/cards", { listId, title });
  return response.data;
};

export const getCard = async (cardId) => {
  const response = await apiClient.get(`/cards/${cardId}`);
  return response.data;
};

export const updateCard = async (cardId, title) => {
  const response = await apiClient.put(`/cards/${cardId}`, { title });
  return response.data;
};

export const deleteCard = async (cardId) => {
  const response = await apiClient.delete(`/cards/${cardId}`);
  return response.data;
};

export const updateCardPosition = async (data) => {
  console.log("Sending data to updateCardPosition:", data);
  const response = await apiClient.put("/cards/position", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
