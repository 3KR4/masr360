"use client";
import React, { useContext } from "react";
import Slider from "@mui/material/Slider";
import {
  tourismCategoriesEn,
  tourismCategoriesAr,
  productCategoriesEn,
  productCategoriesAr,
  nightsCategoriesEn,
  nightsCategoriesAr,
} from "@/data";
import "@/styles/components/filters.css";
import { IoIosClose } from "react-icons/io";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";

const Filters = ({
  availability,
  priceRange,
  selectedCategory,
  setAvailability,
  setPriceRange,
  setSelectedCategory,
  showAvailability,
  catsType,
  screenSize,
  active,
  setActive,
}) => {
  const t = useTranslate();
  const { locale } = useContext(mainContext);

  const cats =
    catsType === "product"
      ? locale == "en"
        ? productCategoriesEn
        : productCategoriesAr
      : catsType === "night"
      ? locale == "en"
        ? nightsCategoriesEn
        : nightsCategoriesAr
      : locale == "en"
      ? tourismCategoriesEn
      : tourismCategoriesAr;
  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
  };
  const handleAvailabilityClick = (status) => {
    setAvailability((prev) => (prev === status ? null : status));
  };

  const handleCategoryClick = (cat, sub = null) => {
    if (!sub) {
      setSelectedCategory((prev) => ({
        catId: prev.catId === cat.id ? null : cat.id,
        subCatId: null,
        catLabel: prev.catId === cat.id ? null : cat.name,
        subCatLabel: null,
      }));
    } else {
      setSelectedCategory((prev) => ({
        ...prev,
        subCatId: prev.subCatId === sub.id ? null : sub.id,
        subCatLabel: prev.subCatId === sub.id ? null : sub.name,
      }));
    }
  };

  return (
    <div className={`filters ${active ? "active" : ""}`}>
      {screenSize !== "large" && (
        <IoIosClose className="close" onClick={() => setActive(false)} />
      )}

      {/* Availability Filter */}
      {showAvailability && (
        <>
          <div className="holder availability">
            <h4>{t.marketplace.filter_by_availability}</h4>
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
                  {status === "inStock"
                    ? t.marketplace.in_stock
                    : t.marketplace.out_of_stock}
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div className="holder">
            <h4>{t.marketplace.filter_by_price}</h4>
            <p>{t.marketplace.enter_price_range}</p>

            <div className="price-input">
              <div className="field">
                <span>{t.marketplace.min}</span>
                <h3>{priceRange[0]}</h3>
              </div>

              <hr className="separator" />

              <div className="field">
                <h3>{priceRange[1]}</h3>
                <span>{t.marketplace.max}</span>
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
                "& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible":
                  {
                    boxShadow: "0px 0px 0px 7px rgb(94 94 94 / 16%)",
                  },
              }}
            />
          </div>

          <hr />
        </>
      )}

      <div className="holder">
        <h4>{t.marketplace.filter_by_categories}</h4>
        <ul>
          {cats.map((cat) => (
            <li key={cat.id}>
              <div
                className={`main-cat ${
                  selectedCategory.catId === cat.id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                <span>{cat.icon}</span> {cat.name}
              </div>

              {cat.subcategories && selectedCategory.catId === cat.id && (
                <div className="sub-cats">
                  {cat.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className={`sub-cat ${
                        selectedCategory.subCatId === sub.id ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(cat, sub)}
                    >
                      ▸ {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filters;
