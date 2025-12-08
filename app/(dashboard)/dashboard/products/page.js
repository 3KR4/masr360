"use client";
import React, { useContext, useState, useRef } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";

import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { mainContext } from "@/Contexts/mainContext";
import { products } from "@/data";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

export default function Products() {
  const { screenSize } = useContext(mainContext);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container products">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">product details</div>
                <div className="header-item">Price</div>
                <div className="header-item">reviews</div>
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
                    <h4 className="green">
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
                    <Link href={`/marketplace/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/products/form?edit=${item?.id}`}>
                      <MdEdit className="edit" />
                    </Link>

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
