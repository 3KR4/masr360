"use client";
import Image from "next/image";
import React from "react";
import Rating from "@mui/material/Rating";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaHeartBroken } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import "@/styles/forms.css";
import useFavoriet from "@/hooks/client/useFavoriet";
import Link from "next/link";
import useTranslate from "@/Contexts/useTranslation";

function Favorites() {
  const { favoritesProducts, favoritesPlaces, removeItem } = useFavoriet();
  const t = useTranslate();
  const text = t.favorites; // سيستخدم favoritesTextAR أو favoritesTextEN حسب اللغة

  return (
    <div className="favorites">
      {favoritesProducts.length > 0 || favoritesPlaces.length > 0 ? (
        <>
          {/* عنوان الصفحة */}
          <div
            className="title-holder pages container"
            style={{ marginBottom: "20px" }}
          >
            <h1 className="main-title">
              <hr />
              {text.title}
              <hr />
            </h1>
            <p className="sub-title">{text.subtitle}</p>
          </div>

          <div className="container">
            {/* المنتجات */}
            {favoritesProducts.length > 0 && (
              <>
                <h4 className="tableTitle">{text.productsList}</h4>
                <div className="table-container">
                  <div className="table-header">
                    <div className="header-item details">
                      {text.tableHeaders.product.details}
                    </div>
                    <div className="header-item">
                      {text.tableHeaders.product.price}
                    </div>
                    <div className="header-item category">
                      {text.tableHeaders.product.category}
                    </div>
                    <div className="header-item rating">
                      {text.tableHeaders.product.rating}
                    </div>
                    <div className="header-item">
                      {text.tableHeaders.product.remove}
                    </div>
                  </div>

                  <div className="table-items">
                    {favoritesProducts.map((item) => (
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
                            inStockText={text.tableHeaders.product.inStock}
                            outOfStockText={
                              text.tableHeaders.product.outOfStock
                            }
                          />
                        </div>
                        <Link href={`/places?cat=${item?.id}`} className="link">
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
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* الأماكن */}
            {favoritesPlaces.length > 0 && (
              <>
                <h4 className="tableTitle">{text.placesList}</h4>
                <div className="table-container">
                  <div className="table-header forPlace">
                    <div className="header-item details">
                      {text.tableHeaders.place.details}
                    </div>
                    <div className="header-item location">
                      {text.tableHeaders.place.location}
                    </div>
                    <div className="header-item">
                      {text.tableHeaders.place.remove}
                    </div>
                  </div>

                  <div className="table-items forPlace">
                    {favoritesPlaces.map((item) => (
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
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="error-page container">
          <FaHeartBroken />
          <h4>{text.empty.title}</h4>
          <p>{text.empty.description}</p>
          <div className="btns">
            <Link href={`/market`} className="main-button">
              {text.empty.buttons.marketplace}
            </Link>
            <Link href={`/market`} className="main-button">
              {text.empty.buttons.egypt}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
