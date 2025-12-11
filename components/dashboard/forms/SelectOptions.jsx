import { productCategories } from "@/data";
import React from "react";
import { useState, useContext } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { forms } from "@/Contexts/forms";

function SelectOptions() {
  const { compsInput, selectedCat, setSelectedCat ,updateCompsInput } = useContext(forms);
  const [activeCat, setActiveCat] = useState(false);

  const filteredCategories = productCategories.filter((x) =>
    x.name.toLowerCase().includes(compsInput.cats.toLowerCase())
  );
  return (
    <div className="box forInput">
      <label htmlFor="category">Category</label>
      <div className="filters for-cats">
        <div className="btn">
          <h4 onClick={() => setActiveCat(true)} className="ellipsis">
            {activeCat ? (
              <input
                autoFocus
                value={compsInput.cats}
                onChange={(e) => updateCompsInput("cats", e.target.value)}
                placeholder="search in categories"
                className="search-input"
                id="category"
              />
            ) : !selectedCat ? (
              "Select product category"
            ) : (
              `category: ${selectedCat}`
            )}
          </h4>

          {activeCat ? (
            <IoMdClose
              className="main-ico"
              onClick={() => setActiveCat(false)}
            />
          ) : (
            <IoIosArrowDown
              className="main-ico"
              onClick={() => setActiveCat(true)}
            />
          )}
        </div>

        <div className={`menu ${activeCat ? "active" : ""}`}>
          {filteredCategories?.length > 0 ? (
            filteredCategories.map((cat, index) => (
              <button
                type="button"
                key={index}
                className={`${selectedCat === cat.name ? "active" : ""}`}
                onClick={() => {
                  setSelectedCat(selectedCat === cat.name ? "" : cat.name);
                  setActiveCat(false);
                  updateCompsInput("cats", "");
                }}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <div className="no-results">No results</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
