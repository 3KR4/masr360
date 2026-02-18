import axios from "axios";

const api = axios.create({
  baseURL: "https://masr360-backend-k8ir.vercel.app/api/v1",
});

// حط التوكن هنا
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
