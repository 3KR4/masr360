import React from "react";
import { useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { forms } from "@/Contexts/forms";
import useTranslate from "@/Contexts/useTranslation";

function Tags() {
    const t = useTranslate();

  const {
    tags,
    setTags,
    compsInput,
    updateCompsError,
    compsErrors,
    updateCompsInput,
  } = useContext(forms);

  const addTag = () => {
    const raw = compsInput.tags;
    if (!raw.trim()) {
      updateCompsError("tags", "the tag must be at least 3 characters");
      return;
    }

    const newTags = raw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const invalid = newTags.filter((t) => t.length < 3);
    if (invalid.length) {
      updateCompsError("tags", "each tag must be at least 3 characters");
      return;
    }

    const duplicates = newTags.filter((t) => tags.includes(t));
    if (duplicates.length) {
      updateCompsError("tags", "this tag has already been added before");
      return;
    }

    setTags([...tags, ...newTags]);
    updateCompsInput("tags", "");
    updateCompsError("tags", "");
  };
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    updateCompsError("tags", "");
  };
  return (
    <div className="box forInput">
      <label>{t.dashboard.forms.tags}</label>

      <div className="inputHolder tags">
        <div className="holder flex">
          <input
            value={compsInput.tags}
            onChange={(e) => {
              updateCompsInput("tags", e.target.value);
              updateCompsError("tags", "");
            }}
            placeholder={t.dashboard.forms.tagsPlaceholder}
          />
          <button
            className="main-button for-tags"
            type="button"
            onClick={addTag}
          >
            {t.dashboard.forms.add}
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
