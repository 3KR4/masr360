"use client";
import Image from "next/image";
import React, { useState, useMemo, useContext, Suspense } from "react";
import { governments, places, products } from "@/data";
import CardItem from "@/components/CardItem";
import Navigations from "@/components/navigations";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { IoIosClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";

export default function DisplayContent({ type }) {
  const { screenSize } = useContext(mainContext);

  let data = [];

  if (type === "gov") {
    data = governments;
  } else if (type === "place") {
    data = places;
  } else if (type === "product") {
    data = products;
  }

  const [openFilters, setOpenFilters] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleRemoveFilter = (filter) => {
    if (filter === "availability") setAvailability(null);
    if (filter === "price") setPriceRange([0, 10000]);
    if (filter === "category") setSelectedCategory(null);
  };

  return (
    <div className="fluid-container big-holder">
      {type !== "gov" && (
        <Filters
          availability={availability}
          priceRange={priceRange}
          selectedCategory={selectedCategory}
          setAvailability={setAvailability}
          setPriceRange={setPriceRange}
          setSelectedCategory={setSelectedCategory}
          handleRemoveFilter={handleRemoveFilter}
          showAvailability={type == "product"}
          catsType={type}
          screenSize={screenSize}
          active={openFilters}
          setActive={setOpenFilters}
        />
      )}

      <div className="holder">
        {type !== "gov" &&
          (screenSize !== "large" ||
            availability ||
            selectedCategory ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 10000) && (
            <div className="selected-filters">
              <strong
                onClick={() => {
                  if (screenSize !== "large") {
                    setOpenFilters(true);
                  }
                }}
                className={screenSize !== "large" ? "main-button" : ""}
              >
                Selected Filters
              </strong>

              {availability && (
                <p onClick={() => handleRemoveFilter("availability")}>
                  Availability: {availability} <IoIosClose className="remove" />
                </p>
              )}

              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <p onClick={() => handleRemoveFilter("price")}>
                  Price: {priceRange[0]} - {priceRange[1]}{" "}
                  <IoIosClose className="remove" />
                </p>
              )}

              {selectedCategory && (
                <p onClick={() => handleRemoveFilter("category")}>
                  Category: {selectedCategory} <IoIosClose className="remove" />
                </p>
              )}
            </div>
          )}

        <div className="grid-holder">
          {data?.map((item) => (
            <CardItem key={item.id} item={item} type={type} />
          ))}
        </div>
        {type !== "gov" && (
          <Pagination
            pageCount={50}
            screenSize={screenSize}
            onPageChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}
