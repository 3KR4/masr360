"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const mainContext = createContext();

export const MainProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState("large");

  const pathname = usePathname();

  useEffect(() => {
    function getScreenSize() {
      const width = window.innerWidth;
      if (width < 768) return "small";
      if (width < 992) return "med";
      return "large";
    }

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <mainContext.Provider
      value={{
        pathname,
        screenSize,
      }}
    >
      {children}
    </mainContext.Provider>
  );
};
