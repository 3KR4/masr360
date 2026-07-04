"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { clearAuth, setAccessToken } from "@/services/axios";
import {
  getCurentUser,
  refreshAuthSession,
} from "@/services/auth/auth.service";

const AuthContext = createContext(null);

const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(() => !getStoredUser());

  const login = ({ user, accessToken, token }) => {
    setAccessToken(accessToken || token || null);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    clearAuth();
    localStorage.removeItem("user");
    localStorage.setItem("_logout", "true");
    window.location.href = "/";
  };

  const fetchUser = useCallback(async () => {
    const res = await getCurentUser();
    const currentUser = res.data?.user || null;

    setUser(currentUser);

    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }

    return currentUser;
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await refreshAuthSession();
      setAccessToken(res.data.accessToken);
      return await fetchUser();
    } catch (err) {
      clearAuth();
      setUser(null);
      localStorage.removeItem("user");
      return null;
    }
  }, [fetchUser]);

  useEffect(() => {
    const initAuth = async () => {
      const wasLoggedOut = localStorage.getItem("_logout");
      if (wasLoggedOut) {
        localStorage.removeItem("_logout");
        setLoading(false);
        return;
      }
      await refreshCurrentUser();
      setLoading(false);
    };

    initAuth();
  }, [refreshCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
