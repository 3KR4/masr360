"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import CardItem from "@/components/CardItem";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { IoIosClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";
import { getService } from "@/services/api/getService";
import {
  nightsEn,
  nightsAr,
  placesEn,
  placesAr,
  productsEn,
  productsAr,
  governoratesEn,
  governoratesAr,
} from "@/data";
import useTranslate from "@/Contexts/useTranslation";

export default function DisplayContent({ type, isSharedData = false, shared }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

  const [data, setData] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);

  const [availability, setAvailability] = useState(null);
  console.log(t.cart[availability]);

  const [priceRange, setPriceRange] = useState([0, 10000]);

  const [selectedCategory, setSelectedCategory] = useState({
    catId: null,
    subCatId: null,
    catLabel: null,
    subCatLabel: null,
  });

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    let response;

    // const fetchData = async () => {
    //   try {
    //     if (type === "gov")
    //       response = (await getService.getGovernorates()) || {
    //         data: locale == "en" ? governoratesEn : governoratesAr,
    //       };
    //     else if (type === "place" && !isSharedData)
    //       response = (await getService.getPlaces()) || {
    //         data: locale == "en" ? placesEn : placesAr,
    //       };
    //     else if (type === "product")
    //       response = { data: locale == "en" ? productsEn : productsAr };
    //     else if (type === "night")
    //       response = { data: locale == "en" ? nightsEn : nightsAr };
    //     else response = { data: shared };

    //     setData(response?.data || []);
    //   } catch (error) {
    //     console.error("Fetch error:", error);
    //     setData([]);
    //   }
    // };

    if (type === "gov") {
      response = locale === "en" ? governoratesEn : governoratesAr;
    } else if (type === "place" && !isSharedData) {
      response = locale === "en" ? placesEn : placesAr;
    } else if (type === "place" && isSharedData) {
      response = locale === "en" ? placesEn : placesAr;
    } else if (type === "product") {
      response = locale === "en" ? productsEn : productsAr;
    } else if (type === "night") {
      response = locale === "en" ? nightsEn : nightsAr;
    } else {
      response = locale === "en" ? governoratesEn : governoratesAr;
    }

    setData(
      isSharedData
        ? response.filter((x) => x.governorate.id == shared)
        : response,
    );

    // fetchData();
  }, [type, isSharedData, shared, locale]);

  /* ===================== REMOVE FILTER ===================== */
  const handleRemoveFilter = (filter) => {
    if (filter === "availability") setAvailability(null);
    if (filter === "price") setPriceRange([0, 10000]);
    if (filter === "cat")
      setSelectedCategory({
        catId: null,
        subCatId: null,
        catLabel: null,
        subCatLabel: null,
      });
    if (filter === "subCat")
      setSelectedCategory((prev) => ({
        ...prev,
        subCatId: null,
        subCatLabel: null,
      }));
  };

  const hasActiveFilters =
    availability ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    selectedCategory.catId ||
    selectedCategory.subCatId;

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
          showAvailability={type === "product"}
          catsType={type}
          screenSize={screenSize}
          active={openFilters}
          setActive={setOpenFilters}
        />
      )}

      <div className="holder">
        {type !== "gov" && (screenSize !== "large" || hasActiveFilters) && (
          <div className="selected-filters">
            <strong
              onClick={() => screenSize !== "large" && setOpenFilters(true)}
              className={screenSize !== "large" ? "main-button" : ""}
            >
              {t.marketplace.selected_filters}
            </strong>

            {availability && (
              <p onClick={() => handleRemoveFilter("availability")}>
                {t.marketplace.availability}: {t.cart[availability]}
                <IoIosClose className="remove" />
              </p>
            )}

            {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
              <p onClick={() => handleRemoveFilter("price")}>
                {t.dashboard.forms.price}: {priceRange[0]} - {priceRange[1]}
                <IoIosClose className="remove" />
              </p>
            )}

            {selectedCategory.catLabel && (
              <p onClick={() => handleRemoveFilter("cat")}>
                {t.dashboard.forms.category}: {selectedCategory.catLabel}
                <IoIosClose className="remove" />
              </p>
            )}

            {selectedCategory.subCatLabel && (
              <p onClick={() => handleRemoveFilter("subCat")}>
                {t.dashboard.forms.subCategory}: {selectedCategory.subCatLabel}
                <IoIosClose className="remove" />
              </p>
            )}
          </div>
        )}

        <div className="grid-holder">
          {data.map((item) => (
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
