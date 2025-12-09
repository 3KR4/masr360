"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const dashboard = createContext();

export const DashBoardProvider = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [filtersState, setFiltersState] = useState({
    name: "",
    price: "",
    status: "",
    date: "",
    availability: "",
  });
  const [selectedCats, setSelectedCats] = useState({
    cat: "",
    subCat: "",
    gov: "",
  });
  const updateFilter = (key, value, type) => {
    if (type == "filters") {
      setFiltersState((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setSelectedCats((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  return (
    <dashboard.Provider
      value={{
        pathname,
        searchParams,
        searchText,
        setSearchText,
        selectedCats,
        filtersState,
        updateFilter,
      }}
    >
      {children}
    </dashboard.Provider>
  );
};
