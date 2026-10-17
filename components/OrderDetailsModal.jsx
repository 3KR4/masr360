"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { FaBan, FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { cancelOrder } from "@/services/orders/orders.service";
import { useNotification } from "@/Contexts/NotificationContext";
import DisplayPrice from "@/components/DisplayPrice";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import "@/styles/components/order-details-modal.css";

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onOrderCancelled,
  onEdit,
  onDelete,
}) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const { addNotification } = useNotification();

  const [currentOrder, setCurrentOrder] = useState(order);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    setCurrentOrder(order);
    setShowCancelConfirm(false);
    setCancelError(null);
  }, [order]);

  // Handle Escape key: closes confirmation modal first, or the main modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showCancelConfirm) {
          setShowCancelConfirm(false);
        } else {
          onClose?.();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showCancelConfirm, onClose]);

  if (!isOpen || !currentOrder) return null;

  const dateLocale = locale === "AR" ? "ar-EG" : "en-US";
  const currency = locale === "AR" ? "ج.م" : "L.E";

  // Helpers for customer info
  const customerName =
    currentOrder.user?.username ||
    currentOrder.user?.name ||
    currentOrder.user?.fullName ||
    currentOrder.customerName ||
    "—";
  const customerEmail = currentOrder.user?.email || "—";
  const customerPhone =
    currentOrder.user?.phoneNumber || currentOrder.user?.phone || "—";

  // Helpers for address
  const location = currentOrder.location || {};
  const city = location.city || "—";
  const street = location.street || "—";
  const home = location.home || "—";
  const fullAddress = location.fullAddress || "—";
  const mapLink = location.googleMapsLink || null;

  // Helpers for overview & pricing
  const statusKey = currentOrder.orderStatus
    ?.toLowerCase()
    .replace(/\s+/g, "_");
  const paymentKey = currentOrder.paymentMethod
    ?.toLowerCase()
    .replace(/\s+/g, "_");

  const itemsList = currentOrder.items || [];
  const totalItemsCount = itemsList.reduce(
    (sum, it) => sum + (it.quantity || 1),
    0
  );

  const priceAfterDiscount =
    currentOrder.priceAfterDiscount !== undefined && currentOrder.priceAfterDiscount !== null
      ? Number(currentOrder.priceAfterDiscount)
      : Number(currentOrder.totalPrice || 0);

  const deliveryFees =
    currentOrder.dilveryFees !== undefined && currentOrder.dilveryFees !== null
      ? Number(currentOrder.dilveryFees)
      : currentOrder.deliveryFees !== undefined && currentOrder.deliveryFees !== null
      ? Number(currentOrder.deliveryFees)
      : 0;

  const finalTotal = priceAfterDiscount + deliveryFees;
  const rawTotalPrice =
    currentOrder.discount > 0 && currentOrder.totalPrice
      ? currentOrder.totalPrice
      : priceAfterDiscount;

  const formattedDate = new Date(
    currentOrder.date || currentOrder.createdAt
  ).toLocaleString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getProductImage = (product) => {
    if (!product) return "/placeholder.png";
    if (Array.isArray(product.imgs) && product.imgs[0]) {
      return typeof product.imgs[0] === "string"
        ? product.imgs[0]
        : product.imgs[0]?.url || "/placeholder.png";
    }
    if (Array.isArray(product.images) && product.images[0]) {
      return typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url || "/placeholder.png";
    }
    if (product.img) {
      return typeof product.img === "string"
        ? product.img
        : product.img?.url || "/placeholder.png";
    }
    return "/placeholder.png";
  };

  const getProductName = (product) => {
    if (!product) return "—";
    const activeLocale = String(locale || "EN").toUpperCase();
    const tr =
      product.translations?.[activeLocale] ||
      product.translations?.[activeLocale.toLowerCase()] ||
      product.translations?.[locale];
    return tr?.name || product.name || "—";
  };

  const getCategoryDetails = (product) => {
    if (!product) return { parent: "", sub: "" };
    const activeLocale = String(locale || "EN").toUpperCase();

    const parentCat = product.category;
    const subCat = product.subCategory;

    let parentName = "";
    let subName = "";

    if (parentCat) {
      if (typeof parentCat === "string") {
        parentName = parentCat;
      } else {
        const tr =
          parentCat.translations?.[activeLocale] ||
          parentCat.translations?.[activeLocale.toLowerCase()];
        parentName = tr?.name || parentCat.name || "";
      }
    }

    if (subCat) {
      if (typeof subCat === "string") {
        subName = subCat;
      } else {
        const tr =
          subCat.translations?.[activeLocale] ||
          subCat.translations?.[activeLocale.toLowerCase()];
        subName = tr?.name || subCat.name || "";
      }
    }

    return { parent: parentName, sub: subName };
  };

  const handleCancelOrder = async () => {
    if (!currentOrder?._id) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelOrder(currentOrder._id);
      const updated = { ...currentOrder, orderStatus: "cancelled" };
      setCurrentOrder(updated);
      setShowCancelConfirm(false);
      onOrderCancelled?.(currentOrder._id);
      addNotification({
        type: "success",
        message: t.orders.cancelSuccess || "Order cancelled successfully.",
      });
    } catch (err) {
      console.error("Failed to cancel order:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        t.orders.cancelFailed ||
        "Failed to cancel order.";
      setCancelError(errMsg);
      addNotification({
        type: "error",
        message: errMsg,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const isPending = currentOrder.orderStatus === "pending";

  return (
    <>
      <div className="order-details-overlay" onClick={onClose}>
        <div
          className="order-details-modal container"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-details-modal-title"
        >
          {/* Header */}
          <div className="order-details-header">
            <div className="order-details-header-left">
              <h2 id="order-details-modal-title" className="order-details-title">
                {t.orders.orderDetails || "ORDER DETAILS"}
              </h2>
              <span className="order-id-badge">#{currentOrder._id?.slice(-8)}</span>
            </div>
            <button
              className="order-details-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <IoClose />
            </button>
          </div>

          {/* Scrollable Body: Divided into Two Main Sections */}
          <div className="order-details-body">
            {/* SECTION 1: DATA SECTION (CUSTOMER, ADDRESS, OVERVIEW WITH TOTALS) */}
            <div className="order-info-grid">
              {/* Card 1: CUSTOMER */}
              <div className="order-info-card">
                <h3 className="order-card-heading">
                  {t.orders.customer || "CUSTOMER"}
                </h3>
                <ul className="order-card-list">
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.customerName || "Name"}:
                    </span>
                    <span className="order-card-value">{customerName}</span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.customerEmail || "Email"}:
                    </span>
                    <span className="order-card-value">{customerEmail}</span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.customerPhone || "Phone"}:
                    </span>
                    <span className="order-card-value">{customerPhone}</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: ADDRESS */}
              <div className="order-info-card">
                <h3 className="order-card-heading">
                  {t.orders.address || "ADDRESS"}
                </h3>
                <ul className="order-card-list">
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.city || "City"}:
                    </span>
                    <span className="order-card-value">{city}</span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.street || "Street"}:
                    </span>
                    <span className="order-card-value">{street}</span>
                  </li>
                  {home && home !== "—" && (
                    <li className="order-card-item">
                      <span className="order-card-label">
                        {t.orders.home || "Home"}:
                      </span>
                      <span className="order-card-value">{home}</span>
                    </li>
                  )}
                  {fullAddress && fullAddress !== "—" && (
                    <li className="order-card-item">
                      <span className="order-card-label">
                        {t.orders.fullAddress || "Address"}:
                      </span>
                      <span className="order-card-value">{fullAddress}</span>
                    </li>
                  )}
                  {mapLink && (
                    <li>
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="order-card-map-link"
                      >
                        <FaExternalLinkAlt size={11} />
                        {t.orders.viewOnMap || "View on Google Maps"}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Card 3: OVERVIEW WITH STATUS & TOTAL PRICE / DELIVERY FEES INLINE */}
              <div className="order-info-card">
                <h3 className="order-card-heading">
                  {t.orders.overview || "OVERVIEW"}
                </h3>
                <ul className="order-card-list">
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.status || "Status"}:
                    </span>
                    <span className={`status-pill ${statusKey}`}>
                      {t.orders.statusTypes?.[statusKey] || currentOrder.orderStatus}
                    </span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.orderDate || "Order Date"}:
                    </span>
                    <span className="order-card-value">{formattedDate}</span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.paymentMethod || "Payment Method"}:
                    </span>
                    <span className="order-card-value">
                      {t.orders.paymentTypes?.[paymentKey] || currentOrder.paymentMethod}
                    </span>
                  </li>
                  <li className="order-card-item">
                    <span className="order-card-label">
                      {t.orders.totalItems || "Total Items"}:
                    </span>
                    <span className="order-card-value">
                      {String(totalItemsCount).padStart(2, "0")}
                    </span>
                  </li>

                  {/* Total Price & Delivery Fees Side by Side */}
                  <li className="order-card-item order-card-item-split">
                    <div className="order-split-side">
                      <span className="order-card-label">
                        {t.orders.totalPrice || "Total Price"}:
                      </span>
                      <span className="order-card-value">
                        {Number(rawTotalPrice).toFixed(2)} {currency}
                      </span>
                    </div>
                    <span className="order-split-slash">/</span>
                    <div className="order-split-side">
                      <span className="order-card-label">
                        {t.orders.deliveryFees || "Delivery Fees"}:
                      </span>
                      <span className="order-card-value">
                        {Number(deliveryFees).toFixed(2)} {currency}
                      </span>
                    </div>
                  </li>

                  {currentOrder.discount > 0 && (
                    <li className="order-card-item">
                      <span className="order-card-label">
                        {t.orders.discount || "Discount"}:
                      </span>
                      <span className="order-card-value" style={{ color: "#34d399" }}>
                        -{Number(currentOrder.discount).toFixed(2)} {currency}
                      </span>
                    </li>
                  )}
                  <li className="order-card-item highlight-row">
                    <span className="order-card-label highlight">
                      {t.orders.finalTotal || "Final Amount"}:
                    </span>
                    <span className="order-card-value highlight">
                      {Number(finalTotal).toFixed(2)} {currency}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: PRODUCTS TABLE SECTION - REPLICA OF CART TABLE (2fr 1fr 1fr .8fr) */}
            <div className="order-products-section">
              <h3 className="order-section-title">
                {t.orders.orderProducts || "ORDER PRODUCTS"}
              </h3>

              <div className="table-container orders">
                <div className="table-header">
                  {screenSize !== "small" ? (
                    <>
                      <div className="header-item details">
                        {t.cart?.productDetails || "Product Details"}
                      </div>
                      <div className="header-item">
                        {t.cart?.price || "Price"}
                      </div>
                      <div className="header-item">
                        {t.cart?.quantity || "Quantity"}
                      </div>
                      <div className="header-item">
                        {t.orders?.itemTotal || t.cart?.total || "Total"}
                      </div>
                    </>
                  ) : (
                    <div className="header-item" style={{ fontSize: "17px" }}>
                      {t.cart?.cartItems || t.orders?.orderProducts || "Products"}
                    </div>
                  )}
                </div>

                <div className="table-items">
                  {itemsList.length > 0 ? (
                    itemsList.map((item, idx) => {
                      const prod = item.product || {};
                      const prodName = getProductName(prod);
                      const prodImg = getProductImage(prod);
                      const { parent: catParent, sub: catSub } =
                        getCategoryDetails(prod);
                      const catString =
                        catParent && catSub
                          ? `${catParent} / ${catSub}`
                          : catParent || catSub || "";

                      const rawPrice = Number(prod.price || item.price || 0);
                      const discountVal = Number(prod.discount || 0);
                      const unitPrice =
                        discountVal > 0
                          ? rawPrice - (rawPrice * discountVal) / 100
                          : rawPrice;

                      const qty = item.quantity || 1;
                      const lineTotal =
                        item.itemTotal !== undefined
                          ? Number(item.itemTotal)
                          : unitPrice * qty;
                      const prodId = prod._id || prod.id || item._id;

                      return (
                        <div key={idx} className="table-item">
                          <div className="holder">
                            <Link
                              href={`/marketplace/${prodId}`}
                              className="item-image"
                            >
                              <Image
                                src={prodImg}
                                alt={prodName}
                                width={115}
                                height={100}
                                className="product-image"
                              />
                            </Link>

                            <div className="item-details">
                              <Link
                                href={`/marketplace/${prodId}`}
                                className="item-name"
                              >
                                {prodName}
                              </Link>
                              {catString && (
                                <Link
                                  href={`/marketplace`}
                                  className="link"
                                >
                                  {catString}
                                </Link>
                              )}
                            </div>
                          </div>

                          <div className="item-price">
                            <DisplayPrice
                              price={rawPrice}
                              sale={discountVal}
                              stock={1}
                              qty={1}
                              priceLabel={t.cart?.price}
                              saleLabel={t.cart?.sale}
                              outOfStockLabel={t.cart?.outOfStock}
                              lastPriceLabel={t.cart?.lastPrice}
                              discountLabel={t.cart?.discount}
                            />
                          </div>

                          <div className="item-quantity">
                            <div
                              className="quantity-controls"
                              style={{ border: "none", background: "transparent" }}
                            >
                              <span
                                className="quantity-number"
                                style={{ fontSize: "16px", fontWeight: "700" }}
                              >
                                {String(qty).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          <div
                            className="item-total"
                            style={{
                              fontWeight: "700",
                              color: "var(--main-color)",
                              fontSize: "15px",
                            }}
                          >
                            {lineTotal.toFixed(2)} {currency}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "var(--paragraph)",
                      }}
                    >
                      {t.orders.noProducts || "No products in this order"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="order-details-footer">
            <div className="order-details-footer-actions">
              {isPending && (
                <button
                  type="button"
                  className="order-cancel-btn"
                  onClick={() => {
                    setCancelError(null);
                    setShowCancelConfirm(true);
                  }}
                >
                  <FaBan />
                  {t.orders.cancelOrder || "Cancel Order"}
                </button>
              )}

              {onEdit && (
                <button
                  type="button"
                  className="order-edit-action-btn"
                  onClick={() => onEdit(currentOrder)}
                >
                  <MdEdit />
                  {locale === "AR" ? "تعديل الطلب" : "Edit Order"}
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  className="order-delete-action-btn"
                  onClick={() => onDelete(currentOrder._id)}
                >
                  <FaTrashAlt />
                  {locale === "AR" ? "حذف الطلب" : "Delete Order"}
                </button>
              )}
            </div>

            <button className="order-close-action-btn" onClick={onClose}>
              {t.orders.close || "Close"}
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal Popup (Opens ON TOP of the Order Details Modal) */}
      {showCancelConfirm && (
        <div
          className="order-cancel-modal-overlay"
          onClick={() => !isCancelling && setShowCancelConfirm(false)}
        >
          <div
            className="order-cancel-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-order-modal-title"
          >
            <div className="order-cancel-modal-icon">
              <FaBan />
            </div>

            <h3 id="cancel-order-modal-title" className="order-cancel-modal-title">
              {t.orders.cancelConfirmTitle || "Cancel Order"}
            </h3>

            <p className="order-cancel-modal-text">
              {t.orders.cancelConfirmMessage ||
                "Are you sure you want to cancel this order? This action cannot be undone."}
            </p>

            {cancelError && (
              <p className="order-cancel-modal-error">
                {cancelError}
              </p>
            )}

            <div className="order-cancel-modal-actions">
              <button
                type="button"
                className="btn-keep-order"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                {t.orders.close || "Close"}
              </button>
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling
                  ? t.orders.cancelling || "Cancelling..."
                  : t.orders.confirm || "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
