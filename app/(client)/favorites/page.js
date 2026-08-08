"use client";
import Image from "next/image";
import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaHeartBroken } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import "@/styles/forms.css";
import useFavoriet from "@/hooks/client/useFavoriet";
import Link from "next/link";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";

function Favorites() {
  const { favoritesProducts, favoritesPlaces, removeItem, loading } = useFavoriet();
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const text = t.favorites;

  if (loading) {
    return (
      <div className="error-page container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="favorites">
      {favoritesProducts.length > 0 || favoritesPlaces.length > 0 ? (
        <>
          <div className="title-holder pages container" style={{ marginBottom: "20px" }}>
            <h1 className="main-title">
              <hr />
              {text.title}
              <hr />
            </h1>
            <p className="sub-title">{text.subtitle}</p>
          </div>

          <div className="container">
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
                          <Link href={`/marketplace/${item?.id}`} className="item-image">
                            <Image
                              src={item?.images?.[0]}
                              alt={item?.name}
                              width={128}
                              height={100}
                              className="product-image"
                            />
                          </Link>
                          <Link href={`/marketplace/${item?.id}`} className="item-name">
                            {item?.name}
                          </Link>
                        </div>
                        <div className="item-price">
                          <DisplayPrice
                            price={item?.price}
                            sale={item?.sale}
                            stock={item?.stock}
                            inStockText={text.tableHeaders.product.inStock}
                            outOfStockText={text.tableHeaders.product.outOfStock}
                          />
                        </div>
                        <Link
                          href={`/marketplace?cat=${item?.category}`}
                          className="link"
                        >
                          {item?.categoryName}
                        </Link>
                        <div className="item-rating center">
                          <Rating
                            name="read-only"
                            value={item?.rate || 0}
                            precision={0.1}
                            readOnly
                            sx={{ color: "#ea8c43", fontSize: "18px" }}
                          />
                          <span className="reviews-count">
                            ({item?.reviewsCount || 0}) {t.mainCard.reviews}
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
                      <div key={item?._id || item?.id} className="table-item">
                        <div className="holder">
                          <Link
                            href={`/places/${item?._id || item?.id}`}
                            className="item-image"
                          >
                            <Image
                              src={item?.imgs?.[0]?.url || item?.images?.[0]}
                              alt={item?.name}
                              width={128}
                              height={100}
                              className="product-image"
                            />
                          </Link>
                          <div className="item-details">
                            <Link
                              href={`/places/${item?._id || item?.id}`}
                              className="item-name"
                            >
                              {item?.name}
                            </Link>
                            <p className="description">{item?.desc || item?.description}</p>
                          </div>
                        </div>
                        <div className="item-remove">
                          <button
                            onClick={() => removeItem("place", item?._id || item?.id)}
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
            <Link href={`/marketplace`} className="main-button">
              {text.empty.buttons.marketplace}
            </Link>
            <Link href={`/discover`} className="main-button">
              {text.empty.buttons.egypt}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
