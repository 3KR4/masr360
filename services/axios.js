import axios from "axios";

// -------------------- BASE CONFIG --------------------
// const BASE_URL = "https://api.m360travel.com/api/v1";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.m360travel.com/api/v1";

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

const PUBLIC_AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/validateOtp",
  "/auth/refresh",
];

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

const shouldSkipAuth = (config = {}) => {
  if (config.skipAuth) {
    return true;
  }

  const requestUrl = config.url || "";
  return PUBLIC_AUTH_ROUTES.some((route) => requestUrl.includes(route));
};

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
  if (shouldSkipAuth(config)) {
    return config;
  }

  if (!accessToken) {
    try {
      await refreshToken();
    } catch (err) {
      return config;
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
      original &&
      !original._retry &&
      !shouldSkipAuth(original) &&
      accessToken
    ) {
      original._retry = true;

      try {
        await refreshToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (err) {
        clearAuth();

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
