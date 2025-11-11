"use client";
import React from "react";
import Slider from "@mui/material/Slider";
import { tourismCategories, productCategories } from "@/data";
import "@/styles/components/filters.css";
import { IoIosClose } from "react-icons/io";

const Filters = ({
  availability,
  priceRange,
  selectedCategory,
  setAvailability,
  setPriceRange,
  setSelectedCategory,
  handleRemoveFilter,
  showAvailability,
  catsType,
  screenSize,
  active,
  setActive,
}) => {
  const handleAvailabilityClick = (status) => {
    setAvailability((prev) => (prev === status ? null : status));
  };

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryClick = (name) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  };

  const cats = catsType == "products" ? productCategories : tourismCategories;
  return (
    <div className={`filters ${active ? "active" : ""}`}>
      {screenSize !== "large" && (
        <IoIosClose className="close" onClick={() => setActive(false)} />
      )}

      {/* Availability Filter */}
      {showAvailability && (
        <>
          <div className="holder">
            <h4>Filter by Availability</h4>
            <ul>
              {["inStock", "outOfStock"].map((status) => (
                <li
                  key={status}
                  className={availability === status ? "active" : ""}
                  onClick={() => handleAvailabilityClick(status)}
                >
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="input"
                      checked={availability === status}
                      readOnly
                    />
                    <span className="custom-checkbox"></span>
                  </label>
                  {status === "inStock" ? "In Stock" : "Out of Stock"}
                </li>
              ))}
            </ul>
          </div>
          <hr />
        </>
      )}

      {/* Price Filter */}
      <div className="holder">
        <h4>Filter by Price</h4>
        <p>Enter min and max price</p>
        <div className="price-input">
          <div className="field">
            <span>min</span>
            <h3>{priceRange[0]}</h3>
          </div>
          <hr className="separator" />
          <div className="field">
            <h3>{priceRange[1]}</h3>
            <span>max</span>
          </div>
        </div>

        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          min={0}
          max={10000}
          className="price-slider"
          sx={{
            "& .MuiSlider-thumb": {
              width: 15,
              height: 15,
            },
            "& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 7px rgb(94 94 94 / 16%)",
            },
          }}
        />
      </div>

      <hr />

      {/* Categories Filter */}
      <div className="holder">
        <h4>Filter by Categories</h4>
        <ul>
          {cats.map((x) => (
            <li
              key={x.id}
              className={selectedCategory === x.name ? "active" : ""}
              onClick={() => handleCategoryClick(x.name)}
            >
              <span>{x.icon}</span> {x.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filters;
