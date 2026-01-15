"use client";
import Image from "next/image";
import React from "react";
import "@/styles/pages/tables.css";
import "@/styles/forms.css";
import { orders } from "@/data";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";

function Orders() {
  const t = useTranslate();

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
            {orders.length > 0 && (
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
                    // تحضير القيم للترجمة
                    const paymentKey = item?.payment
                      ?.toLowerCase()
                      .replace(/\s+/g, "_");
                    const shippingKey = item?.shipping
                      ?.toLowerCase()
                      .replace(/\s+/g, "_");
                    const statusKey = item?.orderStatus
                      ?.toLowerCase()
                      .replace(/\s+/g, "_");

                    return (
                      <div key={item?.id} className="table-item">
                        <div className="images">
                          {item.cart.slice(0, 3).map((x, index) => (
                            <Image
                              key={index}
                              src={x?.image}
                              alt={x?.name}
                              fill
                              className="product-image"
                            />
                          ))}
                          {item.cart.length > 3 && (
                            <span className="counter">
                              +{item.cart.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="price">
                          ${item?.cartTotalPrice.toFixed(2)}
                        </div>
                        <p className="total-quantity">
                          {t.orders.itemsCount.replace(
                            "{count}",
                            item?.totalItems
                          )}
                        </p>
                        <p className={`payment `}>
                          {t.orders.paymentTypes?.[paymentKey] || item?.payment}
                        </p>
                        <p className={`shipping ${shippingKey}`}>
                          {t.orders.shippingTypes?.[shippingKey] ||
                            item?.shipping}
                        </p>
                        <p className={`status ${statusKey}`}>
                          {t.orders.statusTypes?.[statusKey] ||
                            item?.orderStatus}
                        </p>
                        <div className="date">
                          {new Date(item?.orderDate).toLocaleDateString(
                            "en-US",
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
            )}
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
