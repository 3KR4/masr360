"use client";
import { createContext, useContext, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const forms = createContext();

export const FormsCompsProvider = ({ children }) => {
  // global
  const [compsInput, setCompsInput] = useState({
    tags: "",
    cats: "",
    specs: "",
    images: "",
  });
  const [compsErrors, setCompsErrors] = useState({
    tags: "",
    cats: "",
    specs: "",
    images: "",
  });
  const updateCompsInput = (key, value) => {
    setCompsInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const updateCompsError = (key, value) => {
    setCompsErrors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Tags
  const [tags, setTags] = useState([]);

  // Specific
  const [specifications, setSpecifications] = useState([]);

  const [images, setImages] = useState([]);

  const [isSubmited, setisSubmited] = useState(false);

  // Category select
  const [selectedCat, setSelectedCat] = useState("");

  return (
    <forms.Provider
      value={{
        tags,
        setTags,
        images,
        setImages,
        specifications,
        setSpecifications,
        compsInput,
        compsErrors,
        updateCompsInput,
        updateCompsError,
        selectedCat,
        setSelectedCat,
        isSubmited,
        setisSubmited,
      }}
    >
      {children}
    </forms.Provider>
  );
};
