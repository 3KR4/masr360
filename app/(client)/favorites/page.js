"use client";
import Image from "next/image";
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import "@/styles/pages/tables.css";
import { FaTrashAlt } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import "@/styles/forms.css";
import useFavoriet from "@/hooks/client/useFavoriet";
import { FaHeartBroken } from "react-icons/fa";
import Link from "next/link";

function Favorites() {
  const { favoritesProducts, favoritesPlaces, removeItem } = useFavoriet();

  return (
    <div className="favorites">
      {favoritesProducts.length > 0 || favoritesPlaces.length > 0 ? (
        <>
          <div
            className="title-holder pages container"
            style={{ marginBottom: "20px" }}
          >
            <h1 className="main-title">
              <hr />
              your favorites list
              <hr />
            </h1>
            <p className="sub-title">
              View all the products and places you’ve added to your favorites —
              a quick way to keep track of what you love and revisit them
              anytime.
            </p>
          </div>

          <div className="container">
            {favoritesProducts.length > 0 && (
              <>
                <h4 className="tableTitle">Products List</h4>
                <div className="table-container">
                  <div className="table-header">
                    <div className="header-item details">product details</div>
                    <div className="header-item">Price</div>
                    <div className="header-item category">category</div>
                    <div className="header-item rating">rating</div>
                    <div className="header-item">Remove</div>
                  </div>

                  <div className="table-items">
                    {favoritesProducts.map((item) => {
                      return (
                        <div key={item?.id} className="table-item">
                          <div className="holder">
                            <Link
                              href={`/market/${item?.id}`}
                              className="item-image"
                            >
                              <Image
                                src={item?.image}
                                alt={item?.name}
                                width={128}
                                height={100}
                                className="product-image"
                              />
                            </Link>
                            <Link
                              href={`/market/${item?.id}`}
                              className="item-name"
                            >
                              {item?.name}
                            </Link>
                          </div>
                          <div className="item-price">
                            <DisplayPrice
                              price={item?.price}
                              sale={item?.sale}
                              stock={item?.stock}
                            />
                          </div>

                          <Link
                            href={`/places?cat=${item?.id}`}
                            className="link"
                          >
                            {item?.category}
                          </Link>
                          <div className="item-rating center">
                            <Rating
                              name="read-only"
                              value={item?.rate}
                              precision={0.1}
                              readOnly
                              sx={{ color: "#ea8c43", fontSize: "18px" }}
                            />
                            <span className="reviews-count">
                              ({item?.reviewsCount}) review
                            </span>
                          </div>
                          <div className="item-remove">
                            <button
                              onClick={() => removeItem("product", item?.id)}
                              className="remove-btn"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            {favoritesPlaces.length > 0 && (
              <>
                {" "}
                <h4 className="tableTitle">Places List</h4>
                <div className="table-container">
                  <div className="table-header forPlace">
                    <div className="header-item details">place details</div>

                    <div className="header-item location">location</div>
                    <div className="header-item">Remove</div>
                  </div>

                  <div className="table-items forPlace">
                    {favoritesPlaces.map((item) => {
                      return (
                        <div key={item?.id} className="table-item">
                          <div className="holder">
                            <Link
                              href={`/places/${item?.id}`}
                              className="item-image"
                            >
                              <Image
                                src={item?.image}
                                alt={item?.name}
                                width={128}
                                height={100}
                                className="product-image"
                              />
                            </Link>

                            <div className="item-details">
                              <Link
                                href={`/places/${item?.id}`}
                                className="item-name"
                              >
                                {item?.name}
                              </Link>
                              <p className="description">{item?.description}</p>
                            </div>
                          </div>
                          <Link href={`/discover/1`} className="link">
                            {item?.govermorate}
                          </Link>

                          <div className="item-remove">
                            <button
                              onClick={() => removeItem("place", item?.id)}
                              className="remove-btn"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="error-page container">
          <FaHeartBroken />
          <h4>Your favorites list is empty</h4>
          <p>
            You haven’t added any products or places to your favorites yet.
            Start exploring and save the ones you love — they’ll appear here for
            easy access later!
          </p>
          <div className="btns">
            <Link href={`/market`} className="main-button">
              Explore the marketplace
            </Link>
            <Link href={`/market`} className="main-button">
              discover egypt
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
