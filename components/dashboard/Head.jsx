"use client";
import React, { useState, useRef, useContext } from "react";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaSearch } from "react-icons/fa";
import { filters, tourismCategories, productCategories } from "@/data";
import Link from "next/link";
import Navigations from "@/components/Navigations";
import { IoIosClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { dashboard } from "@/Contexts/dashboard";
import { getBreadcrumbItems } from "@/utlies/getBreadcrumbItems ";

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

  const inputRef = useRef(null);
  const navigationitems = getBreadcrumbItems(pathname, searchParams);

  const [activeMenu, setActiveMenu] = useState(null);
  const [catsSearch, setCatsSearch] = useState("");

  const handleActiveMenu = (type) => {
    setActiveMenu(type);
    setCatsSearch("");
  };

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
    const cleanPath = pathname.split("?")[0];
    return cleanPath + "/form";
  }

  const cats =
    navigationitems[0]?.name == "places list"
      ? tourismCategories
      : navigationitems[0]?.name == "products list"
      ? productCategories
      : [];
  const subCats = tourismCategories?.find(
    (x) => x.name == selectedCats.cat
  )?.subcategories;

  let listedCats = [];
  if (activeMenu == "cat") {
    listedCats = cats?.filter((x) =>
      x.name.toLowerCase().includes(catsSearch.toLowerCase())
    );
  } else {
    listedCats = subCats?.filter((x) =>
      x.name.toLowerCase().includes(catsSearch.toLowerCase())
    );
  }

  return (
    <div className="head">
      <Navigations items={navigationitems} container="no" isDashBoard={true} />
      {!pathname.includes("/form") && (
        <div className="right">
          {navigationitems[0] && (
            <div className="search">
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`search in ${navigationitems[0]?.name}`}
              />
              {searchText !== "" ? (
                <IoIosClose
                  className="main-ico"
                  onClick={() => setSearchText("")}
                />
              ) : (
                <FaSearch
                  onClick={() => inputRef.current?.focus()}
                  className="main-ico"
                  style={{ padding: "7px" }}
                />
              )}
            </div>
          )}
          {cats && (
            <div className="filters for-cats">
              <div className="btn">
                <h4
                  onClick={() => handleActiveMenu("cat")}
                  className="ellipsis"
                >
                  {activeMenu == "cat" ? (
                    <input
                      autoFocus
                      value={catsSearch}
                      onChange={(e) => setCatsSearch(e.target.value)}
                      placeholder={"filter by categories:"}
                      className="search-input"
                    />
                  ) : !selectedCats.cat ? (
                    "filter by categories:"
                  ) : (
                    selectedCats.cat
                  )}
                </h4>
                {activeMenu == "cat" ? (
                  <IoMdClose
                    className="main-ico"
                    onClick={() => setActiveMenu(null)}
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => handleActiveMenu("cat")}
                    className="main-ico"
                  />
                )}
              </div>

              <div className={`menu ${activeMenu == "cat" ? "active" : ""}`}>
                {listedCats?.length > 0 ? (
                  listedCats?.map((x, index) => (
                    <button
                      key={index}
                      className={`${
                        selectedCats.cat == x.name ? "active" : ""
                      }`}
                      onClick={() => {
                        if (selectedCats.cat === x.name) {
                          updateFilter("cat", "", "categories");
                        } else {
                          updateFilter("cat", x.name, "categories");
                        }
                        updateFilter("subCat", "", "categories");
                        setActiveMenu(null);
                        setCatsSearch("");
                      }}
                    >
                      {x.icon} {x.name}
                    </button>
                  ))
                ) : (
                  <div className="no-results">no match results</div>
                )}
              </div>
            </div>
          )}
          {subCats && (
            <div className="filters for-cats sub-cats">
              <div className="btn">
                <h4
                  onClick={() => handleActiveMenu("sub-cat")}
                  className="ellipsis"
                >
                  {activeMenu == "sub-cat" ? (
                    <input
                      autoFocus
                      value={catsSearch}
                      onChange={(e) => setCatsSearch(e.target.value)}
                      placeholder={"filter by sub cats:"}
                      className="search-input"
                    />
                  ) : !selectedCats.subCat ? (
                    "filter by sub cats:"
                  ) : (
                    selectedCats.subCat
                  )}
                </h4>
                {activeMenu == "sub-cat" ? (
                  <IoMdClose
                    className="main-ico"
                    onClick={() => setActiveMenu(null)}
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => handleActiveMenu("sub-cat")}
                    className="main-ico"
                  />
                )}
              </div>

              <div
                className={`menu ${activeMenu == "sub-cat" ? "active" : ""}`}
              >
                {listedCats?.length > 0 ? (
                  listedCats?.map((x, index) => (
                    <button
                      key={index}
                      className={`${
                        selectedCats.subCat == x.name ? "active" : ""
                      }`}
                      onClick={() => {
                        if (selectedCats.subCat === x.name) {
                          updateFilter("subCat", "", "categories");
                        } else {
                          updateFilter("subCat", x.name, "categories");
                        }
                        setActiveMenu(null);
                        setCatsSearch("");
                      }}
                    >
                      {x.name}
                    </button>
                  ))
                ) : (
                  <div className="no-results">no match results</div>
                )}
              </div>
            </div>
          )}
          {currentFilters.length !== 0 && (
            <div className="filters">
              <div className="btn">
                <h4 onClick={() => handleActiveMenu("filters")}>
                  Sorting and filters:
                </h4>
                {activeMenu == "filters" ? (
                  <IoMdClose
                    className="main-ico"
                    onClick={() => setActiveMenu(null)}
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => handleActiveMenu("filters")}
                    className="main-ico"
                  />
                )}
              </div>

              <div
                className={`menu ${activeMenu == "filters" ? "active" : ""}`}
              >
                {currentFilters?.map((x, index) => (
                  <div className="hold" key={index}>
                    <h5>
                      {x.id}:{" "}
                      {filtersState[x.id] && (
                        <IoMdClose
                          onClick={() => updateFilter(x.id, "", "filters")}
                        />
                      )}
                    </h5>

                    <ul>
                      {x.filters.map((y, i) => (
                        <li
                          key={i}
                          className={
                            filtersState[x.id] === y.value ? "active" : ""
                          }
                          onClick={() => updateFilter(x.id, y.value, "filters")}
                        >
                          {y.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          {canCreate(navigationitems[0]?.name) && (
            <Link href={getCreateLink(pathname)} className="main-button">
              Create {getBaseName(navigationitems[0]?.name)}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Head;
