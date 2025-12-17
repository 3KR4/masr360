"use client";
import React, { useState, useRef, useContext } from "react";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import "@/styles/dashboard/globals.css";

import { FaSearch } from "react-icons/fa";
import { IoIosClose, IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

import Link from "next/link";
import Navigations from "@/components/Navigations";

import { filters, tourismCategories, productCategories, govs } from "@/data";
import { dashboard } from "@/Contexts/dashboard";
import { getBreadcrumbItems } from "@/utlies/getBreadcrumbItems";
import useTranslate from "@/Contexts/useTranslation";

function Head() {
  const {
    pathname,
    searchParams,
    searchText,
    setSearchText,
    filtersState,
    selectedCats,
    updateFilter,
  } = useContext(dashboard);

  const t = useTranslate();
  const inputRef = useRef(null);
  const navigationitems = getBreadcrumbItems(pathname, searchParams);

  const [activeMenu, setActiveMenu] = useState(null);
  const [catsSearch, setCatsSearch] = useState("");

  const handleActiveMenu = (type) => {
    setActiveMenu(type);
    setCatsSearch("");
  };

  /* ---------- Filters logic ---------- */
  const currentFilters =
    navigationitems.length === 0
      ? []
      : filters?.find((x) => x.id == navigationitems[0]?.name)?.sorting ||
        filters?.find((x) => x.id === "main")?.sorting;

  function getBaseName(name) {
    if (!name) return "";
    return name.replace(" list", "").trim();
  }

  function canCreate(name) {
    const base = getBaseName(name);
    const allowed = [
      "product",
      "governorate",
      "place",
      "night",
      "event",
      "game",
      "user",
    ];
    return allowed.some((word) => base.includes(word));
  }

  function getCreateLink(pathname) {
    return pathname.split("?")[0] + "/form";
  }

  const citys = ["places list", "events list", "nights list"].includes(
    navigationitems[0]?.name
  )
    ? govs
    : undefined;

  const cats = ["places list", "events list", "nights list"].includes(
    navigationitems[0]?.name
  )
    ? tourismCategories
    : navigationitems[0]?.name === "products list"
    ? productCategories
    : undefined;

  const subCats = tourismCategories?.find(
    (x) => x.name === selectedCats.cat
  )?.subcategories;

  const filteredGovs = citys?.filter((x) =>
    x.toLowerCase().includes(catsSearch.toLowerCase())
  );

  const filteredCats = cats?.filter((x) =>
    x.name.toLowerCase().includes(catsSearch.toLowerCase())
  );

  const filteredSubCats = subCats?.filter((x) =>
    x.name.toLowerCase().includes(catsSearch.toLowerCase())
  );

  return (
    <div className="head">
      <Navigations items={navigationitems} container="no" isDashBoard />

      {!pathname.includes("/form") && (
        <div className="right">
          {/* ---------- Search ---------- */}
          {navigationitems[0] && (
            <div className="search">
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`${t.head.searchIn} ${navigationitems[0]?.name}`}
              />
              {searchText ? (
                <IoIosClose
                  className="main-ico"
                  onClick={() => setSearchText("")}
                />
              ) : (
                <FaSearch
                  className="main-ico"
                  onClick={() => inputRef.current?.focus()}
                />
              )}
            </div>
          )}

          {/* ---------- Governorates ---------- */}
          {citys && (
            <FilterMenu
              label={t.head.filterGov}
              active={activeMenu === "gov"}
              value={selectedCats.gov}
              search={catsSearch}
              setSearch={setCatsSearch}
              onOpen={() => handleActiveMenu("gov")}
              onClose={() => setActiveMenu(null)}
            >
              {filteredGovs?.length ? (
                filteredGovs.map((x, i) => (
                  <button
                    key={i}
                    className={selectedCats.gov === x ? "active" : ""}
                    onClick={() => {
                      updateFilter(
                        "gov",
                        selectedCats.gov === x ? "" : x,
                        "categories"
                      );
                      setActiveMenu(null);
                    }}
                  >
                    {x}
                  </button>
                ))
              ) : (
                <div className="no-results">{t.head.noResults}</div>
              )}
            </FilterMenu>
          )}

          {/* ---------- Categories ---------- */}
          {cats && (
            <FilterMenu
              label={t.head.filterCat}
              active={activeMenu === "cat"}
              value={selectedCats.cat}
              search={catsSearch}
              setSearch={setCatsSearch}
              onOpen={() => handleActiveMenu("cat")}
              onClose={() => setActiveMenu(null)}
            >
              {filteredCats?.length ? (
                filteredCats.map((x, i) => (
                  <button
                    key={i}
                    className={selectedCats.cat === x.name ? "active" : ""}
                    onClick={() => {
                      updateFilter(
                        "cat",
                        selectedCats.cat === x.name ? "" : x.name,
                        "categories"
                      );
                      updateFilter("subCat", "", "categories");
                      setActiveMenu(null);
                    }}
                  >
                    {x.icon} {x.name}
                  </button>
                ))
              ) : (
                <div className="no-results">{t.head.noResults}</div>
              )}
            </FilterMenu>
          )}

          {/* ---------- Create ---------- */}
          {canCreate(navigationitems[0]?.name) && (
            <Link href={getCreateLink(pathname)} className="main-button">
              {t.head.create} {getBaseName(navigationitems[0]?.name)}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Filter Wrapper ---------- */
function FilterMenu({
  label,
  active,
  value,
  search,
  setSearch,
  onOpen,
  onClose,
  children,
}) {
  return (
    <div className="filters for-cats">
      <div className="btn">
        <h4 onClick={onOpen} className="ellipsis">
          {active ? (
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={label}
              className="search-input"
            />
          ) : value ? (
            `${label} ${value}`
          ) : (
            label
          )}
        </h4>
        {active ? (
          <IoMdClose className="main-ico" onClick={onClose} />
        ) : (
          <IoIosArrowDown className="main-ico" onClick={onOpen} />
        )}
      </div>

      <div className={`menu ${active ? "active" : ""}`}>{children}</div>
    </div>
  );
}

export default Head;
