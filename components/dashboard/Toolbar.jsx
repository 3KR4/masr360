"use client";

import React, { useContext, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { LuSettings2 } from "react-icons/lu";
import { dashboard } from "@/Contexts/dashboard";
import { mainContext } from "@/Contexts/mainContext";
import { getBreadcrumbItems } from "@/utlies/getBreadcrumbItems";
import useTranslate from "@/Contexts/useTranslation";

function FilterMenu({
  label,
  active,
  value,
  search,
  setSearch,
  onOpen,
  onClose,
  disabled = false,
  children,
}) {
  return (
    <div className="toolbar-filter-menu">
      <button
        type="button"
        className={`toolbar-filter-trigger ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (disabled) return;
          if (active) {
            onClose();
          } else {
            onOpen();
          }
        }}
      >
        <div className="toolbar-filter-copy">
          <strong className="ellipsis">{value?.name || value || label}</strong>
        </div>
        {active ? <IoMdClose className="main-ico" /> : <IoIosArrowDown className="main-ico" />}
      </button>

      <div className={`toolbar-filter-dropdown ${active ? "active" : ""}`}>
        <div className="toolbar-filter-search">
          <FaSearch />
          <input
            autoFocus={active}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={label}
            className="search-input"
          />
        </div>
        <div className="toolbar-filter-options">{children}</div>
      </div>
    </div>
  );
}

function DashboardToolbar() {
  const {
    pathname,
    searchParams,
    searchText,
    setSearchText,
    selectedCats,
    updateFilter,
  } = useContext(dashboard);
  const {
    locale,
    governorates,
    placeCategories,
    nightCategories,
    productCategories,
  } = useContext(mainContext);
  const t = useTranslate();
  const inputRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [catsSearch, setCatsSearch] = useState("");

  const navigationitems = getBreadcrumbItems(pathname, searchParams);
  const pageKey = navigationitems[0]?.name?.toLowerCase().replace(/\s+/g, "_");

  const citys = ["places_list", "events_list", "nights_list"].includes(pageKey)
    ? governorates
    : undefined;

  const cats =
    pageKey === "places_list"
      ? placeCategories
      : pageKey === "nights_list"
        ? nightCategories
        : undefined;

  const prodCats = pageKey === "products_list" ? productCategories : undefined;

  const subCats =
    pageKey === "places_list" || pageKey === "nights_list"
      ? selectedCats.cat?.subCategories
      : undefined;

  const filteredGovs = citys?.filter((x) =>
    (x.name || "").toLowerCase().includes(catsSearch.toLowerCase()),
  );

  const filteredCats = cats?.filter((x) =>
    (x.name || "").toLowerCase().includes(catsSearch.toLowerCase()),
  );

  const filteredSubCats = subCats?.filter((x) =>
    (x.name || "").toLowerCase().includes(catsSearch.toLowerCase()),
  );

  const filteredProdCats = prodCats?.filter((x) =>
    (x.name || "").toLowerCase().includes(catsSearch.toLowerCase()),
  );

  const filtersCount = useMemo(() => {
    return [
      selectedCats.gov,
      selectedCats.cat,
      selectedCats.subCat,
      selectedCats.category,
      searchText?.trim(),
    ].filter(Boolean).length;
  }, [searchText, selectedCats]);

  const isGovernoratesPage = pageKey === "governorates_list";
  const isPlacesPage = pageKey === "places_list";

  const openMenu = (menu) => {
    setActiveMenu(menu);
    setCatsSearch("");
  };

  if (pathname.includes("/form") || !navigationitems[0]) {
    return null;
  }

  return (
    <div className="dashboard-toolbar-shell">
      <div
        className={`dashboard-toolbar-row ${isGovernoratesPage ? "governorates-toolbar-row" : ""}`}
      >
        <div className="dashboard-toolbar-search compact">
          <div
            className={`dashboard-toolbar-search-input ${searchText ? "has-value" : ""}`}
          >
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
                style={{ padding: "0px" }}
              />
            ) : (
              <FaSearch className="main-ico" onClick={() => inputRef.current?.focus()} />
            )}
          </div>
        </div>

        {!isGovernoratesPage && !isPlacesPage ? (
          <div className="dashboard-toolbar-inline-badge">
            <span className="toolbar-badge">
              <LuSettings2 />
              {filtersCount} active
            </span>
          </div>
        ) : null}

        {citys?.length > 0 && (
          <FilterMenu
            label={t.head.filterGov}
            active={activeMenu === "gov"}
            value={selectedCats.gov}
            search={catsSearch}
            setSearch={setCatsSearch}
            onOpen={() => openMenu("gov")}
            onClose={() => setActiveMenu(null)}
          >
            {filteredGovs?.length ? (
              filteredGovs.map((x) => {
                const isActive =
                  selectedCats.gov?._id === x._id ||
                  selectedCats.gov?.id === x._id ||
                  selectedCats.gov === x._id;
                return (
                  <button
                    key={x._id}
                    className={isActive ? "active" : ""}
                    onClick={() => {
                      updateFilter("gov", isActive ? null : x, "categories");
                      setActiveMenu(null);
                    }}
                  >
                    {x.name}
                  </button>
                );
              })
            ) : (
              <div className="no-results">{t.head.noResults}</div>
            )}
          </FilterMenu>
        )}

        {cats?.length > 0 && (
          <FilterMenu
            label={t.head.filterCat}
            active={activeMenu === "cat"}
            value={selectedCats.cat}
            search={catsSearch}
            setSearch={setCatsSearch}
            onOpen={() => openMenu("cat")}
            onClose={() => setActiveMenu(null)}
          >
            {filteredCats?.length ? (
              filteredCats.map((x) => {
                const isActive =
                  (selectedCats.cat?._id || selectedCats.cat?.id) ===
                  (x._id || x.id);
                return (
                  <button
                    key={x._id || x.id}
                    className={isActive ? "active" : ""}
                    onClick={() => {
                      updateFilter("cat", isActive ? null : x, "categories");
                      updateFilter("subCat", null, "categories");
                      setActiveMenu(null);
                    }}
                  >
                    {x.icon ? <span>{x.icon} </span> : null}
                    {x.name}
                  </button>
                );
              })
            ) : (
              <div className="no-results">{t.head.noResults}</div>
            )}
          </FilterMenu>
        )}

        {(pageKey === "places_list" || (subCats?.length ?? 0) > 0) && (
          <FilterMenu
            label={t.head.filterSubCat}
            active={activeMenu === "subCat"}
            value={selectedCats.subCat}
            search={catsSearch}
            setSearch={setCatsSearch}
            disabled={!selectedCats.cat}
            onOpen={() => openMenu("subCat")}
            onClose={() => setActiveMenu(null)}
          >
            {filteredSubCats?.length ? (
              filteredSubCats.map((x) => {
                const isActive =
                  (selectedCats.subCat?._id || selectedCats.subCat?.id) ===
                  (x._id || x.id);
                return (
                  <button
                    key={x._id || x.id}
                    className={isActive ? "active" : ""}
                    onClick={() => {
                      updateFilter("subCat", isActive ? null : x, "categories");
                      setActiveMenu(null);
                    }}
                  >
                    {x.icon ? <span>{x.icon} </span> : null}
                    {x.name}
                  </button>
                );
              })
            ) : (
              <div className="no-results">{t.head.noResults}</div>
            )}
          </FilterMenu>
        )}

        {prodCats?.length > 0 && (
          <FilterMenu
            label={t.head.filterCat}
            active={activeMenu === "prodCat"}
            value={selectedCats.category}
            search={catsSearch}
            setSearch={setCatsSearch}
            onOpen={() => openMenu("prodCat")}
            onClose={() => setActiveMenu(null)}
          >
            {filteredProdCats?.length ? (
              filteredProdCats.map((x) => (
                <button
                  key={x._id}
                  className={selectedCats.category?._id == x._id ? "active" : ""}
                  onClick={() => {
                    updateFilter(
                      "category",
                      selectedCats.category?._id == x._id ? null : x,
                      "categories",
                    );
                    setActiveMenu(null);
                  }}
                >
                  {x.icon ? <span>{x.icon} </span> : null}
                  {x.name}
                </button>
              ))
            ) : (
              <div className="no-results">{t.head.noResults}</div>
            )}
          </FilterMenu>
        )}

        {!citys?.length && !cats?.length && !subCats?.length && !prodCats?.length ? null : null}
      </div>
    </div>
  );
}

export default DashboardToolbar;
