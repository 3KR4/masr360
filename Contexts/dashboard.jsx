"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const dashboard = createContext();

export const DashBoardProvider = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [activeSort, setActiveSort] = useState(false);
  const [filtersState, setFiltersState] = useState({
    name: "",
    price: "",
    status: "",
    date: "",
    availability: "",
  });
  const updateFilter = (category, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  return (
    <dashboard.Provider
      value={{
        pathname,
        searchParams,
        searchText,
        setSearchText,
        activeSort,
        setActiveSort,
        filtersState,
        setFiltersState,
        updateFilter,
      }}
    >
      {children}
    </dashboard.Provider>
  );
};
