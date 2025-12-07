"use client";
import React, { useContext, useState, useRef } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";


import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye, FaSearch } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { mainContext } from "@/Contexts/mainContext";
import { products, sorting } from "@/data";
import Link from "next/link";
import Navigations from "@/components/Navigations";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
export default function Products() {
  const { screenSize } = useContext(mainContext);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [activeSort, setActiveSort] = useState(false);
  const [filtersState, setFiltersState] = useState({
    name: "",
    price: "",
    status: "",
    date: "",
    availability: "",
  });
  const updateFilter = (category, value) => {
    setFiltersState((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <div className="dash-holder">
      <div className="head">
        <Navigations
          items={[
            {
              name: "all products",
              href: "",
            },
          ]}
          container={`no`}
          isDashBoard={true}
        />
        <div className="right">
          <div className="search">
            <input
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="search in products"
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
              <h4 onClick={() => setActiveSort(true)}>Sort By:</h4>

              <div className="current-filter">
                <h5 onClick={() => setActiveSort(true)}>low to high</h5>
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
            </div>

            <div className={`menu ${activeSort ? "active" : ""}`}>
              {sorting.map((x, index) => (
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
          <Link href={"/"} className="main-button">
            Create Product
          </Link>
        </div>
      </div>

      <div className="body">
        <div className="table-container">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">product details</div>
                <div className="header-item">Price</div>
                <div className="header-item">rate</div>
                <div className="header-item">status</div>
                <div className="header-item">stock</div>
                <div className="header-item">Actions</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                cart items
              </div>
            )}
          </div>

          <div className="table-items">
            {products.slice(0, 10).map((item) => {
              return (
                <div key={item.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/`} className="item-name">
                        {item.name}
                      </Link>
                      {screenSize !== "small" && (
                        <>
                          <Link href={`/`} className="link">
                            <span>Category:</span> {item.category}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    <DisplayPrice
                      price={item?.price}
                      sale={item?.sale}
                      stock={item?.stock}
                      qty={item?.quantity}
                      dashboard={true}
                    />
                  </div>
                  <div className="item-rating">
                    <h4>{item?.reviewsCount} review</h4>
                    <div className="row-holder">
                      <Rating
                        name="read-only"
                        value={item.rate}
                        precision={0.1}
                        readOnly
                        sx={{ color: "#ea8c43", fontSize: "19px" }}
                      />
                      <h4>({item?.rate})</h4>
                    </div>
                  </div>
                  <div className="item-overview">
                    <h4>
                      3000 <FaEye />
                    </h4>
                    <h4>
                      1500 <BiSolidPurchaseTagAlt />
                    </h4>
                  </div>
                  <div className="item-stock">
                    <h4
                      className={`${
                        item?.stock == 0 ? "out" : item?.stock < 10 ? "low" : ""
                      }`}
                    >
                      {item?.stock}
                    </h4>
                  </div>

                  <div className="actions">
                    <FaEye className="view" />
                    <hr />
                    <MdEdit className="edit" />
                    <hr />
                    <FaTrashAlt className="delete" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          pageCount={50}
          screenSize={screenSize}
          onPageChange={() => {}}
          isDashBoard={true}
        />
      </div>
    </div>
  );
}
