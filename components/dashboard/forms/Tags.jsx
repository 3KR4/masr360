import React from "react";
import { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { forms } from "@/Contexts/forms";

function Tags() {
  const {
    tags,
    setTags,
    compsInput,
    updateCompsError,
    compsErrors,
    updateCompsInput,
  } = useContext(forms);

  const addTag = () => {
    const trimmed = compsInput.tags.trim();
    if (!trimmed || trimmed.length < 3) {
      updateCompsError("tags", "the tag must be at least 3 characters");
      return;
    }
    if (tags.includes(trimmed.toLowerCase())) {
      updateCompsError("tags", "this tag has already been added before");
      return;
    }

    setTags([...tags, trimmed.toLowerCase()]);
    updateCompsInput("tags", "");
    updateCompsError("tags", "");
  };
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    updateCompsError("tags", "");
  };
  return (
    <div className="box forInput">
      <label>tags</label>
      <div className="inputHolder tags">
        <div className="holder flex">
          <input
            value={compsInput.tags}
            onChange={(e) => {
              updateCompsInput("tags", e.target.value);
              updateCompsError("tags", "");
            }}
            placeholder="enter your tags"
          />
          <button
            className="main-button for-tags"
            type="button"
            onClick={addTag}
          >
            Add
          </button>
        </div>
        {compsErrors.tags && (
          <span className="error">
            <CircleAlert />
            {compsErrors.tags}
          </span>
        )}
        {tags.length > 0 && (
          <div className="tagsList">
            {tags.map((t, i) => (
              <span key={i} className="tag" onClick={() => removeTag(i)}>
                {t}
                <IoClose />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;
