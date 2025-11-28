"use client";
import Image from "next/image";
import React, { useState } from "react";
import "@/styles/pages/tables.css";
import "@/styles/forms.css";
import { orders } from "@/data";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";

function Orders() {
  return (
    <div className="orders">
      {orders.length > 0 ? (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              your orders list
              <hr />
            </h1>
            <p className="sub-title">
              Here you can view all your previous and current orders, track
              their status, and review important details like delivery date,
              payment method, and total cost.ٍ
            </p>
          </div>

          <div className="container">
            {orders.length > 0 && (
              <div className="table-container order-table">
                <div className="table-header">
                  <div className="header-item">products</div>
                  <div className="header-item">tootal price</div>
                  <div className="header-item">products quantity</div>

                  <div className="header-item">payment method</div>
                  <div className="header-item">shipping</div>
                  <div className="header-item">status</div>
                  <div className="header-item">date</div>
                </div>

                <div className="table-items">
                  {orders.map((item) => {
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
                          {`${item?.totalItems < 10 ? "0" : ""}${
                            item?.totalItems
                          } items`}
                        </p>
                        <p className={`payment ${item?.payment}`}>
                          {item?.payment}
                        </p>
                        <p className={`shipping ${item?.shipping}`}>
                          {item?.shipping}
                        </p>
                        <p className={`status ${item?.orderStatus}`}>
                          {item?.orderStatus}
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
          <h4>Your orders list is empty</h4>
          <p>
            You haven’t placed any orders yet. Start exploring our marketplace
            and discover unique handcrafted Egyptian products — once you make a
            purchase, your orders will appear here for easy tracking.
          </p>
          <div className="btns">
            <Link href={`/market`} className="main-button">
              Explore the marketplace
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
