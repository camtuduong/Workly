import apiClient from "./config";

const USER_API = "/user";
const AUTH_API = "/auth";
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
    const { data } = await apiClient.post(`${AUTH_API}/login`, {
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

export const updateLanguage = async (language) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw { message: "No token found" };
    const { data } = await apiClient.put(
      `${USER_API}/language`,
      { language },
      {
        header: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  } catch (error) {
    console.error(
      "Error in updateLanguage API:",
      error.response?.data || error.message,
    );
    throw error.response?.data || { message: "Server error" };
  }
};
export const getAllUsers = async () => {
  const response = await apiClient.get(`${USER_API}/`);
  return response.data;
};
