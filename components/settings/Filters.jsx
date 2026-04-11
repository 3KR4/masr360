"use client";
import React, { useContext, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import "@/styles/components/filters.css";
import { IoIosClose } from "react-icons/io";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getCategories } from "@/services/categories/categories.service";

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

  const [cats, setCats] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const categoryType = catsType === "place" ? "tourism" : catsType;

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setLoadingCats(true);
      try {
        const res = await getCategories({ type: categoryType, lang: locale });
        const rawCategories = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
              ? res.data
              : [];

        const parentCategories = rawCategories.filter((cat) => !cat.parent);
        const childCategories = rawCategories.filter((cat) => cat.parent);

        const formatted = parentCategories.map((cat) => ({
          id: cat._id || cat.id,
          name: cat.name,
          icon: cat.icon || "•",
          subcategories: childCategories
            .filter((sub) =>
              sub.parent?.toString() === (cat._id || cat.id)?.toString(),
            )
            .map((sub) => ({
              id: sub._id || sub.id,
              name: sub.name,
            })),
        }));

        if (isMounted) setCats(formatted);
      } catch (error) {
        console.error("Failed to load category filters:", error);
        if (isMounted) setCats([]);
      } finally {
        if (isMounted) setLoadingCats(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [categoryType, locale]);

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
        catId: cat.id,
        catLabel: cat.name,
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
                "& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible": {
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
        {loadingCats ? (
          <p className="loading">{t.dashboard.forms.loading || "Loading categories..."}</p>
        ) : (
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

                {cat.subcategories?.length > 0 && selectedCategory.catId === cat.id && (
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
        )}
      </div>
    </div>
  );
};

export default Filters;
