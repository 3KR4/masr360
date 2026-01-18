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

import {
  filtersEn,
  filtersAr,
  tourismCategoriesEn,
  tourismCategoriesAr,
  productCategoriesEn,
  productCategoriesAr,
  govsEn,
  govsAr,
} from "@/data";
import { dashboard } from "@/Contexts/dashboard";
import { getBreadcrumbItems } from "@/utlies/getBreadcrumbItems";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";

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
  const { screenSize, locale } = useContext(mainContext);

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
  const filters = locale == "ar" ? filtersAr : filtersEn;

  const currentFilters =
    navigationitems.length == 0
      ? []
      : filters?.find((x) => x.id == navigationitems[0]?.id)?.sorting ||
        filters?.find((x) => x.id == "main")?.sorting;

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

  // ---------- Governorates ----------
  const citysData =
    locale == "en"
      ? govsEn.map((name, index) => ({ id: index, name }))
      : govsAr.map((name, index) => ({ id: index, name }));

  const pageKey = navigationitems[0]?.name?.toLowerCase().replace(/\s+/g, "_"); // مفتاح ثابت للصفحة
  console.log(pageKey);

  const citys = ["places_list", "events_list", "nights_list"].includes(pageKey)
    ? citysData
    : undefined;

  // ---------- Categories ----------
  const tourismCategories =
    locale == "en" ? tourismCategoriesEn : tourismCategoriesAr;
  const productCategories =
    locale == "en" ? productCategoriesEn : productCategoriesAr;

  const cats = ["places_list", "events_list", "nights_list"].includes(pageKey)
    ? tourismCategories
    : pageKey == "products_list"
    ? productCategories
    : undefined;

  const subCats = tourismCategories?.find(
    (x) => x.name == selectedCats.cat.name
  )?.subcategories;

  const filteredGovs = citys?.filter((x) =>
    x.name.toLowerCase().includes(catsSearch.toLowerCase())
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
              active={activeMenu == "gov"}
              value={selectedCats.gov}
              search={catsSearch}
              setSearch={setCatsSearch}
              onOpen={() => handleActiveMenu("gov")}
              onClose={() => setActiveMenu(null)}
            >
              {filteredGovs?.length ? (
                filteredGovs.map((x) => (
                  <button
                    key={x.id}
                    className={selectedCats.gov == x.id ? "active" : ""}
                    onClick={() => {
                      updateFilter(
                        "gov",
                        selectedCats.gov == x.id ? "" : x.id,
                        "categories"
                      );
                      setActiveMenu(null);
                    }}
                  >
                    {x.name}
                  </button>
                ))
              ) : (
                <div className="no-results">{t.head.noResults}</div>
              )}
            </FilterMenu>
          )}

          {/* ---------- Categories ---------- */}
          {cats?.length && (
            <FilterMenu
              label={t.head.filterCat}
              active={activeMenu == "cat"}
              value={selectedCats.cat}
              search={catsSearch}
              setSearch={setCatsSearch}
              onOpen={() => handleActiveMenu("cat")}
              onClose={() => setActiveMenu(null)}
            >
              {filteredCats?.length ? (
                filteredCats.map((x) => (
                  <button
                    key={x.id}
                    className={selectedCats.cat?.id == x.id ? "active" : ""}
                    onClick={() => {
                      updateFilter(
                        "cat",
                        selectedCats.cat?.id == x.id ? null : x,
                        "categories"
                      );
                      updateFilter("subCat", null, "categories");
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
          {subCats?.length && (
            <FilterMenu
              label={t.head.filterSubCat}
              active={activeMenu == "subCat"}
              value={selectedCats.subCat}
              search={catsSearch}
              setSearch={setCatsSearch}
              onOpen={() => handleActiveMenu("subCat")}
              onClose={() => setActiveMenu(null)}
            >
              {filteredSubCats?.length ? (
                filteredSubCats.map((x) => (
                  <button
                    key={x.id}
                    className={selectedCats.subCat?.id == x.id ? "active" : ""}
                    onClick={() => {
                      updateFilter(
                        "subCat",
                        selectedCats.subCat?.id == x.id ? null : x,
                        "categories"
                      );
                      setActiveMenu(null);
                    }}
                  >
                    {x.name}
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
          ) : value?.name ? (
            `${label} ${value?.name}`
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
