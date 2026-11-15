"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAll as getCategories } from "@/services/categories/categories.service";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";

export const mainContext = createContext();

const REFERENCE_DATA_CACHE_PREFIX = "reference-data";
const EMPTY_CATEGORIES = {
  place: [],
  night: [],
  product: [],
};

export const MainProvider = ({ children }) => {
  const pathname = usePathname();
  const [screenSize, setScreenSize] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Default locale is "EN" unless user explicitly chose otherwise
  const [locale, setLocaleState] = useState(() => {
    if (typeof window !== "undefined") {
      const isChosen = localStorage.getItem("locale_chosen") === "true";
      if (isChosen) {
        return localStorage.getItem("locale") || "EN";
      }
      return localStorage.getItem("locale") || "EN";
    }
    return "EN";
  });

  // Default theme is "light" unless user explicitly chose otherwise
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      const isChosen = localStorage.getItem("theme_chosen") === "true";
      if (isChosen) {
        return localStorage.getItem("theme") || "light";
      }
      return "light";
    }
    return "light";
  });

  const [referenceDataLoading, setReferenceDataLoading] = useState(true);
  const [governorates, setGovernorates] = useState([]);
  const [categoriesByType, setCategoriesByType] = useState(EMPTY_CATEGORIES);

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

  // Update HTML attributes when locale changes
  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute(
      "dir",
      locale === "AR" ? "rtl" : "ltr",
    );
  }, [locale]);

  // Update HTML attributes when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Setters that persist user's manual choice to localStorage
  const setLocale = (newLocale) => {
    setLocaleState((prev) => {
      const val = typeof newLocale === "function" ? newLocale(prev) : newLocale;
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", val);
        localStorage.setItem("locale_chosen", "true");
      }
      return val;
    });
  };

  const setTheme = (newTheme) => {
    setThemeState((prev) => {
      const val = typeof newTheme === "function" ? newTheme(prev) : newTheme;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", val);
        localStorage.setItem("theme_chosen", "true");
      }
      return val;
    });
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === "EN" ? "AR" : "EN"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const applyReferenceData = (payload) => {
    setGovernorates(payload.governorates || []);
    setCategoriesByType({
      place: payload.categoriesByType?.place || [],
      night: payload.categoriesByType?.night || [],
      product: payload.categoriesByType?.product || [],
    });
  };

  const fetchReferenceData = async (activeLocale) => {
    const [
      governoratesRes,
      placeCategoriesRes,
      nightCategoriesRes,
      productCategoriesRes,
    ] = await Promise.all([
      getGovernorates("", 1, 10000, activeLocale),
      getCategories({ type: "place", lang: activeLocale }),
      getCategories({ type: "night", lang: activeLocale }),
      getCategories({ type: "product", lang: activeLocale }),
    ]);

    return {
      governorates: governoratesRes.governorates || [],
      categoriesByType: {
        place: placeCategoriesRes.data || [],
        night: nightCategoriesRes.data || [],
        product: productCategoriesRes.data || [],
      },
    };
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cacheKey = `${REFERENCE_DATA_CACHE_PREFIX}-${locale}`;

    const loadCachedData = () => {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (!cached) return false;
        applyReferenceData(cached);
        return true;
      } catch {
        return false;
      }
    };

    const init = async () => {
      const hasCache = loadCachedData();
      setReferenceDataLoading(!hasCache);

      try {
        const freshData = await fetchReferenceData(locale);
        applyReferenceData(freshData);
        localStorage.setItem(cacheKey, JSON.stringify(freshData));
      } catch (error) {
        console.error("Failed to load reference data:", error);
      } finally {
        setReferenceDataLoading(false);
      }
    };

    init();
  }, [locale]);

  const refreshReferenceData = async () => {
    setReferenceDataLoading(true);
    try {
      const payload = await fetchReferenceData(locale);
      applyReferenceData(payload);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          `${REFERENCE_DATA_CACHE_PREFIX}-${locale}`,
          JSON.stringify(payload),
        );
      }
    } catch (error) {
      console.error("Failed to refresh reference data:", error);
      throw error;
    } finally {
      setReferenceDataLoading(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <mainContext.Provider
      value={{
        pathname,
        screenSize,
        locale,
        setLocale,
        toggleLocale,
        theme,
        setTheme,
        toggleTheme,
        governorates,
        categoriesByType,
        placeCategories: categoriesByType.place,
        nightCategories: categoriesByType.night,
        productCategories: categoriesByType.product,
        referenceDataLoading,
        refreshReferenceData,
      }}
    >
      {children}
    </mainContext.Provider>
  );
};

export const useAppData = () => useContext(mainContext);
