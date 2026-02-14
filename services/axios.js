import axios from "axios";

const api = axios.create({
  baseURL: "https://masr360-backend-k8ir.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
  }
  return config;
});

export default api;