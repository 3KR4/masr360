"use client";
import React, { useState, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";

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

  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((item) =>
    item[searchKey][locale].toLowerCase().includes(search.toLowerCase())
  );

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
                placeholder={`Search ${label.toLowerCase()}`}
                className="search-input"
              />
            ) : value ? (
              value
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
            filteredOptions.map((item, index) => (
              <button
                type="button"
                key={index}
                className={value === item[searchKey][locale] ? "active" : ""}
                onClick={() => {
                  onChange(item);
                  setActive(false);
                  setSearch("");
                }}
              >
                {item[searchKey][locale]}
              </button>
            ))
          ) : (
            <div className="no-results">No results</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
