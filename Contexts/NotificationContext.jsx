"use client";
import { createContext, useContext, useRef, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [curentNotficationClosedCount, setCurentNotficationClosedCount] =
    useState(0); // Track closed notifications
  const timeouts = useRef({});

  useEffect(() => {
    // Only run cleanup if there are notifications
    if (curentNotficationClosedCount > 0) {
      // Check if all notifications are closing (none active)
      const allClosing = notificationMessages.every(
        (msg) => msg.status === "closing" || msg.status === ""
      );

      if (allClosing) {
        // Small delay to ensure animations complete
        const timer = setTimeout(() => {
          setNotificationMessages([]);
          setCurentNotficationClosedCount(0);
        }, 700);

        return () => clearTimeout(timer);
      }
    }
  }, [curentNotficationClosedCount]);

  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      ...notification,
      id,
      status: "entering",
    };

    setNotificationMessages((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotificationMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: "active" } : msg))
      );

      timeouts.current[id] = setTimeout(() => {
        closeNotification(id);
      }, 7000);
    }, 10);
  };

  const closeNotification = (id) => {
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }

    setNotificationMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === id ? { ...msg, status: "closing" } : msg
      );

      // Update closed count
      setCurentNotficationClosedCount(
        updated.filter((msg) => msg.status === "closing").length
      );
      return updated;
    });
  };

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificationMessages,
        addNotification,
        curentNotficationClosedCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
