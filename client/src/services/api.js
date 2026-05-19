import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("blockcertify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPublicFileUrl = (path = "") => {
  if (!path) return "#";
  return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
};

export default api;
