"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { governments, places } from "@/data";
import CardItem from "@/components/CardItem";
import Navigations from "@/components/navigations";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import { IoIosClose } from "react-icons/io";

function Page() {
  const [params, setParams] = useState({ type: null, id: null });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const type = search.get("type");
      const id = search.get("id");
      setParams({ type, id });
    }
  }, []);

  const { type, id: govId } = params;
  let data = [];
  let selectedGovernment = null;

  if (type === "governments") {
    data = governments;
  } else if (type === "places") {
    data = places;
  } else if (type === "government" && govId) {
    selectedGovernment = governments.find((gov) => gov.id == govId);
    data = places;
  }

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
      {/* -------- City Section -------- */}
      {selectedGovernment && (
        <div className="city fluid-container">
          <Image
            src={selectedGovernment?.image}
            fill
            alt={selectedGovernment?.name}
          />
          <div className="details">
            <h3>{selectedGovernment?.name}</h3>
            <p>{selectedGovernment?.description}</p>
          </div>
        </div>
      )}

      {/* -------- Title Section -------- */}
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {type === "government"
            ? `${selectedGovernment?.name} places`
            : type === "places"
            ? "discover places"
            : "discover egypt"}
          <hr />
        </h1>

        <p className="sub-title">
          {type === "government" ? (
            <>
              Explore the beauty and attractions of{" "}
              <strong>{selectedGovernment?.name}</strong>. <br />
              Discover its history, landmarks, and hidden treasures only on Masr
              360.
            </>
          ) : type === "places" ? (
            <>
              Discover Egypt’s most remarkable places — from historic landmarks
              to hidden gems. <br />
              With Masr 360, explore top destinations, uncover local stories,
              and experience the true essence of every location.
            </>
          ) : (
            <>
              Egypt is a land of wonders — from ancient monuments to hidden gems
              tucked away in every city. <br />
              With Masr 360, you can explore each government and experience
              Egypt like never before.
            </>
          )}
        </p>
      </div>

      {/* -------- Navigation -------- */}
      <Navigations
        items={[
          {
            name: type?.includes("government") ? "governments" : "places",
            href: "/discover?type=governments",
          },
          selectedGovernment && {
            name: selectedGovernment?.name,
            href: "",
          },
        ].filter(Boolean)}
      />

      {/* -------- Main Holder -------- */}
      <div className="fluid-container big-holder">
        {type !== "governments" && (
          <Filters
            availability={availability}
            priceRange={priceRange}
            selectedCategory={selectedCategory}
            setAvailability={setAvailability}
            setPriceRange={setPriceRange}
            setSelectedCategory={setSelectedCategory}
            handleRemoveFilter={handleRemoveFilter}
            showAvailability={false}
            catsType={"places"}
          />
        )}

        <div className="holder">
          {/* -------- Selected Filters -------- */}
          {(availability ||
            selectedCategory ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 10000) && (
            <div className="selected-filters">
              <strong>Selected Filters:</strong>
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

          {/* -------- Grid -------- */}
          <div className="grid-holder">
            {data?.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                type={type === "governments" ? "gov" : "place"}
              />
            ))}
          </div>

          {/* -------- Pagination -------- */}
          {type !== "governments" && (
            <Pagination pageCount={50} onPageChange={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
