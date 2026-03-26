"use client";
import { createContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const mainContext = createContext();

export const MainProvider = ({ children }) => {
  const pathname = usePathname();

  const [screenSize, setScreenSize] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Screen size
  useEffect(() => {
    function getScreenSize() {
      const width = window.innerWidth;
      if (width < 768) return "small";
      if (width < 992) return "med";
      return "large";
    }

    setScreenSize(getScreenSize());
    setIsReady(true);

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const [locale, setLocale] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("locale") || "EN";
  }
  return "EN";
});

useEffect(() => {
  document.documentElement.setAttribute("lang", locale);
  document.documentElement.setAttribute("dir", locale === "AR" ? "rtl" : "ltr");
  localStorage.setItem("locale", locale);
}, [locale]);

const toggleLocale = () => setLocale((prev) => (prev === "EN" ? "AR" : "EN"));
if (!isReady) {
  return null; // أو Loader صغير حسب رغبتك
}

  // ✅ الشرط بعد كل الـ hooks
  if (!isReady) {
    return null; // أو Loader
  }

  return (
    <mainContext.Provider
      value={{
        pathname,
        screenSize,
        locale,
        setLocale,
        toggleLocale,
      }}
    >
      {children}
    </mainContext.Provider>
  );
};
