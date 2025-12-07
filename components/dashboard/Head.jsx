"use client";
import React, { useState, useRef, useContext } from "react";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaSearch } from "react-icons/fa";
import { filters } from "@/data";
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
    updateFilter,
  } = useContext(dashboard);

  const navigationitems = getBreadcrumbItems(pathname, searchParams);
  const inputRef = useRef(null);
  const [activeSort, setActiveSort] = useState(false);
  const currentFilters =
    filters?.find((x) => x.id == navigationitems[0]?.name)?.sorting ||
    filters?.find((x) => x.id === "other")?.sorting;

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

  return (
    <div className="head">
      <Navigations items={navigationitems} container="no" isDashBoard={true} />
      {!pathname.includes("/form") && (
        <div className="right">
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
          <div className="filters">
            <div className="btn">
              <h4 onClick={() => setActiveSort(true)}>Sorting and filters:</h4>
              {activeSort ? (
                <IoMdClose
                  className="main-ico"
                  onClick={() => setActiveSort(false)}
                />
              ) : (
                <IoIosArrowDown
                  onClick={() => setActiveSort(true)}
                  className="main-ico"
                />
              )}
            </div>

            <div className={`menu ${activeSort ? "active" : ""}`}>
              {currentFilters.map((x, index) => (
                <div className="hold" key={index}>
                  <h5>
                    {x.id}:{" "}
                    {filtersState[x.id] && (
                      <IoMdClose onClick={() => updateFilter(x.id, "")} />
                    )}
                  </h5>

                  <ul>
                    {x.filters.map((y, i) => (
                      <li
                        key={i}
                        className={
                          filtersState[x.id] === y.value ? "active" : ""
                        }
                        onClick={() => updateFilter(x.id, y.value)}
                      >
                        {y.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
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
