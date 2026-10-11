"use client";
import Image from "next/image";
import { useContext, useState, useEffect, useCallback } from "react";
import React from "react";
import "@/styles/pages/tables.css";
import "@/styles/forms.css";
import Link from "next/link";
import { FaBoxOpen, FaEye } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { useAuth } from "@/Contexts/AuthContext";
import { getAllOrders } from "@/services/orders/orders.service";
import OrderDetailsModal from "@/components/OrderDetailsModal";

function Orders() {
  const { locale } = useContext(mainContext);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const t = useTranslate();

  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dateLocale = locale === "AR" ? "ar-EG" : "en-US";

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrdersList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getAllOrders({ page: 1, limit: 50, sort: "date,desc" });
      const data = res?.data || [];
      setOrdersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrdersList([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  const getProductImage = (product) => {
    if (!product) return "/placeholder.png";
    if (Array.isArray(product.images) && product.images[0]) {
      return typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url || "/placeholder.png";
    }
    if (Array.isArray(product.imgs) && product.imgs[0]) {
      return typeof product.imgs[0] === "string"
        ? product.imgs[0]
        : product.imgs[0]?.url || "/placeholder.png";
    }
    return "/placeholder.png";
  };

  const getProductName = (product) => {
    if (!product) return "";
    const activeLocale = (locale || "EN").toUpperCase();
    const tr =
      product.translations?.[activeLocale] || product.translations?.[locale];
    return tr?.name || product.name || "";
  };

  return (
    <div className="orders">
      {loading || authLoading ? (
        <div className="error-page container">
          <div className="loader" />
        </div>
      ) : ordersList.length > 0 ? (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              {t.orders.yourOrdersList}
              <hr />
            </h1>
            <p className="sub-title">{t.orders.subtitle}</p>
          </div>

          <div className="fluid-container">
            <div className="table-container order-table">
              <div className="table-header">
                <div className="header-item">{t.orders.products}</div>
                <div className="header-item">{t.orders.totalPrice}</div>
                <div className="header-item">{t.orders.productsQuantity}</div>
                <div className="header-item">{t.orders.paymentMethod}</div>
                <div className="header-item">{t.orders.shipping}</div>
                <div className="header-item">{t.orders.status}</div>
                <div className="header-item">{t.orders.date}</div>
                <div className="header-item">{t.orders.actions}</div>
              </div>

              <div className="table-items">
                {ordersList.map((item) => {
                  const itemsList = item.items || [];
                  const totalItemsCount = itemsList.reduce(
                    (sum, it) => sum + (it.quantity || 1),
                    0
                  );

                  const paymentKey = item.paymentMethod
                    ?.toLowerCase()
                    .replace(/\s+/g, "_");
                  const statusKey = item.orderStatus
                    ?.toLowerCase()
                    .replace(/\s+/g, "_");

                  const displayPrice =
                    item.priceAfterDiscount !== undefined
                      ? item.priceAfterDiscount
                      : item.totalPrice || 0;

                  return (
                    <div key={item._id} className="table-item">
                      {/* 🖼 PRODUCTS IMAGES */}
                      <div className="images">
                        {itemsList.slice(0, 3).map((it, index) => {
                          const imgSrc = getProductImage(it.product);
                          const prodName = getProductName(it.product);
                          return (
                            <Image
                              key={index}
                              src={imgSrc}
                              alt={prodName || "Product"}
                              width={52}
                              height={52}
                              className="product-image"
                              title={prodName}
                            />
                          );
                        })}

                        {itemsList.length > 3 && (
                          <span className="counter">
                            +{itemsList.length - 3}
                          </span>
                        )}
                      </div>

                      {/* 💰 TOTAL PRICE */}
                      <div className="price">${Number(displayPrice).toFixed(2)}</div>

                      {/* 📦 ITEMS COUNT */}
                      <p className="total-quantity">
                        {t.orders.itemsCount.replace(
                          "{count}",
                          totalItemsCount
                        )}
                      </p>

                      {/* 💳 PAYMENT METHOD */}
                      <p className="payment">
                        {t.orders.paymentTypes?.[paymentKey] || item.paymentMethod}
                      </p>

                      {/* 🚚 SHIPPING (Standard static shipping) */}
                      <p className="shipping standard">
                        {t.orders.shippingTypes?.standard || "Standard Shipping"}
                      </p>

                      {/* 📌 STATUS */}
                      <div className="status-holder">
                        <p className={`status ${statusKey}`}>
                          {t.orders.statusTypes?.[statusKey] || item.orderStatus}
                        </p>
                      </div>

                      {/* 📅 DATE */}
                      <div className="date">
                        {new Date(item.date || item.createdAt).toLocaleDateString(
                          dateLocale,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>

                      {/* 👁 ACTIONS */}
                      <div className="actions">
                        <button
                          type="button"
                          className="order-action-view"
                          title={t.orders.viewDetails || "View Details"}
                          onClick={() => setSelectedOrder(item)}
                        >
                          <FaEye />
                        </button>
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
            <Link href="/marketplace" className="main-button">
              {t.orders.exploreMarketplace}
            </Link>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onOrderCancelled={(cancelledId) => {
          setOrdersList((prev) =>
            prev.map((ord) =>
              ord._id === cancelledId
                ? { ...ord, orderStatus: "cancelled" }
                : ord
            )
          );
        }}
      />
    </div>
  );
}

export default Orders;
