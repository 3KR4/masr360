"use client";
import Image from "next/image";

import React, { useState, useContext } from "react";
import { products } from "@/data";
import CardItem from "@/components/CardItem";
import Navigations from "@/components/navigations";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { IoIosClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";

function Marketplace() {
  const { screenSize } = useContext(mainContext);
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
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          Marketplace
          <hr />
        </h1>
        <p className="sub-title">
          Discover authentic Egyptian crafts and souvenirs made by local
          artisans — each piece reflects the spirit of Egypt.
        </p>
      </div>

      <Navigations
        items={[
          {
            name: "marketplace",
            href: "",
          },
        ].filter(Boolean)}
      />

      <div className="fluid-container big-holder">
        <Filters
          availability={availability}
          priceRange={priceRange}
          selectedCategory={selectedCategory}
          setAvailability={setAvailability}
          setPriceRange={setPriceRange}
          setSelectedCategory={setSelectedCategory}
          handleRemoveFilter={handleRemoveFilter}
          showAvailability={true}
          catsType={"products"}
          screenSize={screenSize}
          active={openFilters}
          setActive={setOpenFilters}
        />

        <div className="holder">
          {(screenSize !== "large" ||
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
            {products?.map((item) => (
              <CardItem key={item.id} item={item} type={"product"} />
            ))}
          </div>

          <Pagination
            pageCount={30}
            screenSize={screenSize}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
