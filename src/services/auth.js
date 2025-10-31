// src/services/auth.js
import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("username", response.data.username);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};

export const getCurrentUser = () => {
  return {
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };
};

export const isLoggedIn = () => !!localStorage.getItem("token");
