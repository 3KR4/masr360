// services/api.js
import axios from "axios";

// -------------------- BASE CONFIG --------------------
const BASE_URL = "https://api.m360travel.com/api/v1";

// Instance بدون interceptors (للـ refresh فقط)
export const plainApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Instance الرئيسي
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// -------------------- TOKEN STORAGE --------------------
let accessToken = null;
let isAuthenticated = false;

export const setAccessToken = (token) => {
  accessToken = token;
  isAuthenticated = !!token;
};

export const clearAuth = () => {
  accessToken = null;
  isAuthenticated = false;
};

export const getAccessToken = () => accessToken;

// -------------------- REFRESH CONTROL --------------------
let refreshPromise = null;

const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = plainApi
      .post("/auth/refresh")
      .then((res) => {
        accessToken = res.data.accessToken;
        return accessToken;
      })
      .catch((err) => {
        accessToken = null;
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// -------------------- REQUEST INTERCEPTOR --------------------
api.interceptors.request.use(async (config) => {
  // لو مفيش توكن → حاول تجيبه
  if (!accessToken) {
    try {
      await refreshToken();
    } catch (err) {
      return config; // سيبه يكمل بدون توكن
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
// -------------------- RESPONSE INTERCEPTOR --------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/refresh") &&
      accessToken
    ) {
      original._retry = true;

      try {
        await refreshToken();

        // نحط التوكن الجديد ونعيد الطلب
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        // logout / redirect
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;

          if (!currentPath.includes("/register")) {
            window.location.href = "/register";
          }
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
