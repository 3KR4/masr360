"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaTrashAlt, FaBoxOpen } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import { dashboard } from "@/Contexts/dashboard";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";
import { getAllOrders, deleteOrder } from "@/services/orders/orders.service";
import Pagination from "@/components/settings/Pagination";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import "@/styles/dashboard/orders.css";

export default function DashboardOrdersPage() {
  const { screenSize, locale } = useContext(mainContext);
  const { searchText, filtersState } = useContext(dashboard);
  const t = useTranslate();
  const { addNotification } = useNotification();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  // 10 items per page limit as requested
  const limit = 10;
  const dateLocale = locale === "AR" ? "ar-EG" : "en-US";
  const selectedStatus = filtersState?.status || "all";

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: "date,desc",
      };

      if (searchText?.trim()) {
        params.search = searchText.trim();
      }

      if (selectedStatus && selectedStatus !== "all") {
        params.orderStatus = selectedStatus;
      }

      const res = await getAllOrders(params);
      const data = res?.data || [];
      const total = res?.total || data.length || 0;

      setOrders(Array.isArray(data) ? data : []);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch dashboard orders:", err);
      setOrders([]);
      setTotalCount(0);
      addNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, selectedStatus, addNotification]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedStatus]);

  const pageCount = Math.max(1, Math.ceil((totalCount || 0) / limit));

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        locale === "AR"
          ? "هل أنت متأكد من حذف هذا الطلب؟"
          : "Are you sure you want to delete this order?"
      )
    ) {
      return;
    }

    setDeletingOrderId(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      addNotification({
        type: "success",
        message:
          locale === "AR"
            ? "تم حذف الطلب بنجاح"
            : "Order deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete order:", err);
      addNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to delete order",
      });
    } finally {
      setDeletingOrderId(null);
    }
  };

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

  return (
    <div className="dash-holder">
      <div className="body">
        {/* Main Orders Table */}
        <div className="table-container order-table dashboard-orders-table">
          <div className="table-header">
            <div className="header-item">{t.orders.products || "Products"}</div>
            <div className="header-item">{t.orders.customer || "Customer"}</div>
            <div className="header-item">{t.orders.totalPrice || "Total Price"}</div>
            <div className="header-item">{t.orders.productsQuantity || "Qty"}</div>
            <div className="header-item">{t.orders.paymentMethod || "Payment"}</div>
            <div className="header-item">{t.orders.status || "Status"}</div>
            <div className="header-item">{t.orders.date || "Date"}</div>
            <div className="header-item">{t.orders.actions || "Actions"}</div>
          </div>

          <div className="table-items">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="loader" style={{ margin: "0 auto" }} />
                <p style={{ marginTop: "12px", color: "var(--paragraph)" }}>
                  {t.dashboard?.forms?.loading || "Loading orders..."}
                </p>
              </div>
            ) : orders.length > 0 ? (
              orders.map((item) => {
                const itemsList = item.items || [];
                const totalItemsCount = itemsList.reduce(
                  (sum, it) => sum + (it.quantity || 1),
                  0
                );

                const statusKey = item.orderStatus
                  ?.toLowerCase()
                  .replace(/\s+/g, "_");
                const paymentKey = item.paymentMethod
                  ?.toLowerCase()
                  .replace(/\s+/g, "_");

                const displayPrice =
                  item.priceAfterDiscount !== undefined
                    ? item.priceAfterDiscount
                    : item.totalPrice || 0;

                const customerUsername =
                  item.user?.username ||
                  item.user?.name ||
                  item.user?.fullName ||
                  item.customerName ||
                  "Customer";
                const customerEmail =
                  item.user?.email || item.user?.phoneNumber || "";

                return (
                  <div key={item._id} className="table-item">
                    {/* 🖼 Products Thumbnails */}
                    <div className="images">
                      {itemsList.slice(0, 3).map((it, idx) => {
                        const imgSrc = getProductImage(it.product);
                        const prodName = getProductName(it.product);
                        return (
                          <Image
                            key={idx}
                            src={imgSrc}
                            alt={prodName}
                            width={48}
                            height={48}
                            className="product-image"
                            title={prodName}
                          />
                        );
                      })}
                      {itemsList.length > 3 && (
                        <span className="counter">+{itemsList.length - 3}</span>
                      )}
                    </div>

                    {/* 👤 Customer Info */}
                    <div className="order-customer-info">
                      <span className="order-customer-name">
                        {customerUsername}
                      </span>
                      {customerEmail && (
                        <span className="order-customer-email">
                          {customerEmail}
                        </span>
                      )}
                    </div>

                    {/* 💰 Total Price */}
                    <div className="price">
                      ${Number(displayPrice).toFixed(2)}
                    </div>

                    {/* 📦 Total Quantity */}
                    <p className="total-quantity">
                      {t.orders.itemsCount?.replace("{count}", totalItemsCount) ||
                        `${totalItemsCount} items`}
                    </p>

                    {/* 💳 Payment Method */}
                    <p className="payment">
                      {t.orders.paymentTypes?.[paymentKey] || item.paymentMethod}
                    </p>

                    {/* 📌 Order Status */}
                    <div className="status-holder">
                      <p className={`status ${statusKey}`}>
                        {t.orders.statusTypes?.[statusKey] || item.orderStatus}
                      </p>
                    </div>

                    {/* 📅 Date */}
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

                    {/* ⚙ Actions: View / Edit / Delete (matching places table) */}
                    <div className="actions">
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => setSelectedOrder(item)}
                        title={t.dashboard?.tables?.view || "View"}
                      >
                        <FaEye className="view" />
                      </button>
                      <hr />
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => setSelectedOrder(item)}
                        title={t.dashboard?.tables?.edit || "Edit"}
                      >
                        <MdEdit className="edit" />
                      </button>
                      <hr />
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => handleDeleteOrder(item._id)}
                        disabled={deletingOrderId === item._id}
                        title={t.dashboard?.tables?.delete || "Delete"}
                      >
                        <FaTrashAlt className="delete" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <FaBoxOpen
                  size={42}
                  style={{ color: "var(--main-color)", opacity: 0.7 }}
                />
                <h4 style={{ margin: "14px 0 6px", color: "var(--title-color)" }}>
                  {t.orders.emptyOrders || "No orders found"}
                </h4>
                <p style={{ color: "var(--paragraph)", fontSize: "14px" }}>
                  {locale === "AR"
                    ? "لا توجد طلبات تطابق الفلتر أو كلمة البحث المحددة."
                    : "No orders match the selected filter or search query."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination (limit is 10) */}
        {!loading && totalCount > limit && (
          <Pagination
            pageCount={pageCount}
            screenSize={screenSize}
            onPageChange={({ selected }) => setPage(selected + 1)}
            isDashBoard={true}
            forcePage={page - 1}
          />
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onOrderCancelled={(cancelledId) => {
          setOrders((prev) =>
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
