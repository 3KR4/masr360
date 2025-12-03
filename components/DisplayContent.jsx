"use client";
import React, { useState, useEffect, useContext } from "react";
import CardItem from "@/components/CardItem";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { IoIosClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";
import { getService } from "@/services/api/getService";
import { nights, products } from "@/data";

export default function DisplayContent({ type, isSharedData, shared }) {
  const { screenSize } = useContext(mainContext);

  const [data, setData] = useState([]);

  const [openFilters, setOpenFilters] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState({
    cat: null,
    subCat: null,
  });

  // Fetch data based on type
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (type === "gov") response = await getService.getGovernorates();
        else if (type === "place" && !isSharedData)
          response = await getService.getPlaces();
        else if (type === "product") response = { data: products };
        else if (type === "night") response = { data: nights };
        else response = { data: shared };

        console.log(shared);

        setData(response.data || []);
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err);
        setData([]);
      }
    };

    fetchData();
  }, [type]);

  const handleRemoveFilter = (filter) => {
    if (filter === "availability") setAvailability(null);
    if (filter === "price") setPriceRange([0, 10000]);
    if (filter === "cat") setSelectedCategory({ cat: null, subCat: null });
    if (filter === "subCat")
      setSelectedCategory((prev) => ({ ...prev, subCat: null }));
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
          showAvailability={type === "product"}
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
            selectedCategory.cat ||
            selectedCategory.subCat ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 10000) && (
            <div className="selected-filters">
              <strong
                onClick={() => {
                  if (screenSize !== "large") setOpenFilters(true);
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

              {selectedCategory.cat && (
                <p onClick={() => handleRemoveFilter("cat")}>
                  cat: {selectedCategory.cat}
                  <IoIosClose className="remove" />
                </p>
              )}

              {selectedCategory.subCat && (
                <p onClick={() => handleRemoveFilter("subCat")}>
                  sub cat: {selectedCategory.subCat}
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
