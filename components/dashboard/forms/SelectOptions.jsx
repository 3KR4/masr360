"use client";
import React, { useState, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

function SelectOptions({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  searchKey = "name",
  disabled = false,
}) {
  const { locale } = useContext(mainContext);
  const t = useTranslate();

  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");

  // فلترة الخيارات بناءً على البحث
  const filteredOptions = options.filter((item) => {
    const itemName = item[searchKey] || "";
    return itemName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={`box forInput ${disabled ? "disabled" : ""}`}>
      <label>{label}</label>

      <div className="filters for-cats">
        <div className="btn">
          <h4 className="ellipsis" onClick={() => !disabled && setActive(true)}>
            {active ? (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.header.search_placeholder}
                className="search-input"
              />
            ) : value ? (
              value?.name
            ) : (
              placeholder
            )}
          </h4>

          {active ? (
            <IoMdClose
              className="main-ico"
              onClick={() => {
                setActive(false);
                setSearch("");
              }}
            />
          ) : (
            <IoIosArrowDown
              className="main-ico"
              onClick={() => !disabled && setActive(true)}
            />
          )}
        </div>

        <div className={`menu ${active ? "active" : ""}`}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item) => (
              <button
                type="button"
                key={item.id}
                className={value?.name === item[searchKey] ? "active" : ""}
                onClick={() => {
                  onChange(item);
                  setActive(false);
                  setSearch("");
                }}
              >
                {item[searchKey]}
              </button>
            ))
          ) : (
            <div className="no-results">{t.dashboard.forms.noResults}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
