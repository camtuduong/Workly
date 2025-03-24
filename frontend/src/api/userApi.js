import apiClient from "./config";

const USER_API = "/users";

export const registerUser = async (username, email, password) => {
  try {
    const { data } = await apiClient.post(`${USER_API}/register`, {
      username,
      email,
      password,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await apiClient.post(`${USER_API}/login`, {
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getUserProfile = async () => {
  try {
    const { data } = await apiClient.get(`${USER_API}/profile`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Server error" };
  }
};
