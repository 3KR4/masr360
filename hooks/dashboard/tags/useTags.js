import { useState } from "react";

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || trimmed.length < 3) {
      setTagError("the tag must be at least 3 characters");
      return;
    }
    if (tags.includes(trimmed.toLowerCase())) {
      setTagError("this tag has already been added before");
      return;
    }

    setTags([...tags, trimmed.toLowerCase()]);
    setTagInput("");
    setTagError("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    setTagError("");
  };

  return {
    tags,
    tagInput,
    tagError,
    setTagError,
    setTagInput,
    addTag,
    removeTag,
  };
};
