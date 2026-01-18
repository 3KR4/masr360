"use client";
import Image from "next/image";
import { useContext } from "react";
import React from "react";
import "@/styles/pages/tables.css";
import "@/styles/forms.css";
import { orders, productsAr, productsEn } from "@/data";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";

function Orders() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();

  const dateLocale = locale === "ar" ? "ar-EG" : "en-US";
  const productsList = locale === "en" ? productsEn : productsAr;

  return (
    <div className="orders">
      {orders.length > 0 ? (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              {t.orders.yourOrdersList}
              <hr />
            </h1>
            <p className="sub-title">{t.orders.subtitle}</p>
          </div>

          <div className="container">
            <div className="table-container order-table">
              <div className="table-header">
                <div className="header-item">{t.orders.products}</div>
                <div className="header-item">{t.orders.totalPrice}</div>
                <div className="header-item">{t.orders.productsQuantity}</div>
                <div className="header-item">{t.orders.paymentMethod}</div>
                <div className="header-item">{t.orders.shipping}</div>
                <div className="header-item">{t.orders.status}</div>
                <div className="header-item">{t.orders.date}</div>
              </div>

              <div className="table-items">
                {orders.map((item) => {
                  // 🔹 Products of this order
                  const orderProducts = productsList.filter((p) =>
                    item.cart.includes(p.id)
                  );

                  // 🔹 Translation keys
                  const paymentKey = item.payment
                    ?.toLowerCase()
                    .replace(/\s+/g, "_");
                  const shippingKey = item.shipping
                    ?.toLowerCase()
                    .replace(/\s+/g, "_");
                  const statusKey = item.orderStatus
                    ?.toLowerCase()
                    .replace(/\s+/g, "_");

                  return (
                    <div key={item.id} className="table-item">
                      {/* 🖼 PRODUCTS IMAGES */}
                      <div className="images">
                        {orderProducts.slice(0, 3).map((product, index) => (
                          <Image
                            key={index}
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="product-image"
                          />
                        ))}

                        {orderProducts.length > 3 && (
                          <span className="counter">
                            +{orderProducts.length - 3}
                          </span>
                        )}
                      </div>

                      {/* 💰 TOTAL PRICE */}
                      <div className="price">
                        ${item.cartTotalPrice.toFixed(2)}
                      </div>

                      {/* 📦 ITEMS COUNT */}
                      <p className="total-quantity">
                        {t.orders.itemsCount.replace(
                          "{count}",
                          item.totalItems
                        )}
                      </p>

                      {/* 💳 PAYMENT */}
                      <p className="payment">
                        {t.orders.paymentTypes?.[paymentKey] || item.payment}
                      </p>

                      {/* 🚚 SHIPPING */}
                      <p className={`shipping ${shippingKey}`}>
                        {t.orders.shippingTypes?.[shippingKey] || item.shipping}
                      </p>

                      {/* 📌 STATUS */}
                      <p className={`status ${statusKey}`}>
                        {t.orders.statusTypes?.[statusKey] || item.orderStatus}
                      </p>

                      {/* 📅 DATE */}
                      <div className="date">
                        {new Date(item.orderDate).toLocaleDateString(
                          dateLocale,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="error-page container">
          <FaBoxOpen />
          <h4>{t.orders.emptyOrders}</h4>
          <p>{t.orders.emptyMessage}</p>
          <div className="btns">
            <Link href={`/market`} className="main-button">
              {t.orders.exploreMarketplace}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
