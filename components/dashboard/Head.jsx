"use client";
import React, { useState, useRef, useContext } from "react";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import "@/styles/dashboard/globals.css";
import { FaSearch } from "react-icons/fa";
import { filters, tourismCategories, productCategories, govs } from "@/data";
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
console.log(navigationitems[0]?.name);

  const citys =
    navigationitems[0]?.name == "places list" ||
    navigationitems[0]?.name == "events list" ||
    navigationitems[0]?.name == "nights list"
      ? govs
      : undefined;
  const cats =
    navigationitems[0]?.name == "places list" ||
    navigationitems[0]?.name == "events list" ||
    navigationitems[0]?.name == "nights list"
      ? tourismCategories
      : navigationitems[0]?.name == "products list"
      ? productCategories
      : undefined;
  const subCats = tourismCategories?.find(
    (x) => x.name == selectedCats.cat
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

  console.log("citys :", citys);
  console.log("cats :", cats);
  console.log("subCats :", subCats);
  

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
          {citys && (
            <div className="filters for-cats gov">
              <div className="btn">
                <h4
                  onClick={() => handleActiveMenu("gov")}
                  className="ellipsis"
                >
                  {activeMenu == "gov" ? (
                    <input
                      autoFocus
                      value={catsSearch}
                      onChange={(e) => setCatsSearch(e.target.value)}
                      placeholder={"filter by governorates:"}
                      className="search-input"
                    />
                  ) : !selectedCats.gov ? (
                    "filter by governorates:"
                  ) : (
                    `city: ${selectedCats.gov}`
                  )}
                </h4>
                {activeMenu == "gov" ? (
                  <IoMdClose
                    className="main-ico"
                    onClick={() => setActiveMenu(null)}
                  />
                ) : (
                  <IoIosArrowDown
                    onClick={() => handleActiveMenu("gov")}
                    className="main-ico"
                  />
                )}
              </div>

              <div className={`menu ${activeMenu == "gov" ? "active" : ""}`}>
                {filteredGovs?.length > 0 ? (
                  filteredGovs?.map((x, index) => (
                    <button
                      key={index}
                      className={`${selectedCats.gov == x ? "active" : ""}`}
                      onClick={() => {
                        if (selectedCats.gov === x) {
                          updateFilter("gov", "", "categories");
                        } else {
                          updateFilter("gov", x, "categories");
                        }
                        setActiveMenu(null);
                        setCatsSearch("");
                      }}
                    >
                      {x}
                    </button>
                  ))
                ) : (
                  <div className="no-results">no match results</div>
                )}
              </div>
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
                    `cat: ${selectedCats.cat}`
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
                {filteredCats?.length > 0 ? (
                  filteredCats?.map((x, index) => (
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
                    `sub Cat: ${selectedCats.subCat}`
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
                {filteredSubCats?.length > 0 ? (
                  filteredSubCats?.map((x, index) => (
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
