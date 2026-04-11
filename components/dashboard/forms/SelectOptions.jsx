"use client";
import React, { useState, useContext, useMemo } from "react";
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

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;

    const keyword = search.toLowerCase();

    return options
      .map((item) => {
        const parentLabel = (item[searchKey] || "").toLowerCase();
        const matchedSubcategories = (item.subcategories || []).filter((sub) =>
          (sub[searchKey] || "").toLowerCase().includes(keyword),
        );

        if (parentLabel.includes(keyword) || matchedSubcategories.length > 0) {
          return {
            ...item,
            subcategories: matchedSubcategories,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [options, search, searchKey]);

  const renderOptions = () => {
    if (filteredOptions.length === 0) {
      return <div className="no-results">{t.dashboard.forms.noResults}</div>;
    }

    return filteredOptions.map((item) => (
      <React.Fragment key={item.id}>
        <button
          type="button"
          className={value?.id === item.id ? "active" : ""}
          onClick={() => {
            onChange(item);
            setActive(false);
            setSearch("");
          }}
        >
          {item.icon && <span className="option-icon">{item.icon}</span>}
          {item[searchKey]}
        </button>

        {item.subcategories?.map((sub) => (
          <button
            key={sub.id}
            type="button"
            className={`nested-option ${value?.id === sub.id ? "active" : ""}`}
            onClick={() => {
              onChange(sub);
              setActive(false);
              setSearch("");
            }}
          >
            {sub.icon && <span className="option-icon">{sub.icon}</span>}
            {sub[searchKey]}
          </button>
        ))}
      </React.Fragment>
    ));
  };

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
          {renderOptions()}
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
