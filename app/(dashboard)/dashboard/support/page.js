"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FaEye, FaTrashAlt, FaWhatsapp, FaHeadset, FaUserCheck, FaUserCircle } from "react-icons/fa";
import { MdEdit, MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";

import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import "@/styles/dashboard/support.css";

import { mainContext } from "@/Contexts/mainContext";
import { dashboard } from "@/Contexts/dashboard";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";

import {
  getAllTickets,
  deleteTicket,
  getSupportCategories,
} from "@/services/support/support.service";
import Pagination from "@/components/settings/Pagination";
import TicketDetailsModal from "@/components/support/TicketDetailsModal";
import TicketEditModal from "@/components/support/TicketEditModal";
import DeleteConfirmModal from "@/components/dashboard/DeleteConfirmModal";

export default function SupportDashboardPage() {
  const { screenSize, locale } = useContext(mainContext);
  const { searchText, filtersState, selectedCats } = useContext(dashboard);
  const t = useTranslate();
  const { addNotification } = useNotification();

  // Data states
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dynamic categories
  const [categories, setCategories] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filters from Dashboard Context / Toolbar
  const selectedStatus = filtersState?.status || "all";
  const selectedMethod = filtersState?.method || "all";
  const selectedCategory =
    selectedCats?.cat?._id || selectedCats?.cat?.id || selectedCats?.cat || "";

  // Load support categories for name resolution and modals
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const data = await getSupportCategories(locale);
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load support categories:", err);
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Main fetch tickets function
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: "createdAt,desc",
      };

      if (searchText?.trim()) params.search = searchText.trim();
      if (selectedStatus && selectedStatus !== "all") params.status = selectedStatus;
      if (selectedMethod && selectedMethod !== "all") params.communicationMethod = selectedMethod;
      if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;

      const res = await getAllTickets(params);

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.tickets)
        ? res.tickets
        : Array.isArray(res)
        ? res
        : [];

      const total =
        typeof res?.totalCount === "number"
          ? res.totalCount
          : typeof res?.total === "number"
          ? res.total
          : typeof res?.count === "number"
          ? res.count
          : list.length;

      setTickets(list);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setTickets([]);
      setTotalCount(0);
      addNotification({
        type: "error",
        message: err?.response?.data?.message || "Failed to load support tickets",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText, selectedStatus, selectedMethod, selectedCategory, addNotification]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedStatus, selectedMethod, selectedCategory]);

  const pageCount = Math.max(1, Math.ceil((totalCount || 0) / limit));

  // Delete ticket handler
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    const ticketId = ticketToDelete._id || ticketToDelete.id;

    setDeletingId(ticketId);
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((item) => (item._id || item.id) !== ticketId));
      setTotalCount((prev) => Math.max(0, prev - 1));
      addNotification({
        type: "success",
        message: t.support?.messages?.ticket_deleted || "Ticket deleted successfully",
      });
      setTicketToDelete(null);
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      addNotification({
        type: "error",
        message: err?.response?.data?.message || t.support?.messages?.ticket_delete_failed || "Failed to delete ticket",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format date
  const formatDate = (dateVal) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(locale === "AR" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Helper for category display
  const getCategoryName = (categoryData) => {
    if (categoryData && typeof categoryData === "object") {
      return (
        categoryData.translations?.[locale]?.name ||
        categoryData.name ||
        categoryData.translations?.EN?.name ||
        categoryData.translations?.AR?.name ||
        "—"
      );
    }
    const found = categories.find(
      (c) => (c._id || c.id) === categoryData
    );
    if (found) {
      return (
        found.translations?.[locale]?.name ||
        found.name ||
        found.translations?.EN?.name ||
        found.translations?.AR?.name ||
        "—"
      );
    }
    return t.support?.categories?.[categoryData] || categoryData || "—";
  };

  const getMethodIcon = (m) => {
    switch (m) {
      case "email":
        return <MdMailOutline size={16} color="#3b82f6" />;
      case "phone":
        return <FiPhone size={15} color="#10b981" />;
      case "whatsapp":
      default:
        return <FaWhatsapp size={16} color="#22c55e" />;
    }
  };

  return (
    <div className="dash-holder">
      <div className="body">
        {/* Main Support Table */}
        <div className="table-container support-table dashboard-support-table">
          <div className="table-header">
            <div className="header-item details">{t.support?.ticket_list?.title || "Ticket"}</div>
            <div className="header-item">{t.support?.ticket_list?.submitter || "Customer"}</div>
            <div className="header-item">{t.support?.ticket_list?.category || "Category"}</div>
            <div className="header-item">{t.support?.ticket_list?.communication || "Method"}</div>
            <div className="header-item">{t.support?.ticket_list?.status || "Status"}</div>
            <div className="header-item">{t.support?.ticket_list?.date || "Date"}</div>
            <div className="header-item">{t.dashboard?.tables?.actions || "Actions"}</div>
          </div>

          <div className="table-items">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="loader" style={{ margin: "0 auto" }} />
                <p style={{ marginTop: "12px", color: "var(--paragraph)" }}>
                  {t.dashboard?.forms?.loading || "Loading tickets..."}
                </p>
              </div>
            ) : tickets.length > 0 ? (
              tickets.map((item) => {
                const ticketId = item._id || item.id;
                const statusKey = item.status || "open";
                const methodKey = item.communicationMethod || "whatsapp";
                const categoryName = getCategoryName(item.category);
                const userInfo =
                  item.userInfo ||
                  (item.user && typeof item.user === "object" ? item.user : null);
                const isGuest = !userInfo;
                const customerName = isGuest
                  ? (locale === "AR" ? "زائر" : "Guest")
                  : (userInfo?.username || userInfo?.name || userInfo?.fullName || (locale === "AR" ? "مستخدم" : "User"));
                const guestContact =
                  item.guestContact?.phoneNumber || item.guestContact?.email || "—";

                return (
                  <div key={ticketId} className="table-item">
                    {/* 🎫 Ticket Details */}
                    <div className="holder">
                      <div className="support-ticket-details">
                        <span className="support-ticket-id">
                          #{ticketId ? ticketId.slice(-6).toUpperCase() : ""}
                        </span>
                        <h4
                          className="support-ticket-title"
                          onClick={() => {
                            setSelectedTicket(item);
                            setIsDetailsOpen(true);
                          }}
                          title={item.title}
                        >
                          {item.title}
                        </h4>
                        <p className="support-ticket-desc" title={item.desc}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* 👤 Submitter Info */}
                    <div className="support-customer-info">
                      {isGuest ? (
                        <>
                          <span className="support-customer-name">
                            <FaUserCircle size={15} color="#ea8c43" />
                            {customerName}
                          </span>
                          <span className="support-customer-meta">
                            {guestContact}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="support-customer-name" title={customerName}>
                            <FaUserCheck size={15} color="#22c55e" />
                            {customerName}
                          </span>
                          {userInfo?.email && (
                            <span className="support-customer-meta" title={userInfo.email}>
                              {userInfo.email}
                            </span>
                          )}
                          {(userInfo?.phoneNumber || userInfo?.phone) && (
                            <span
                              className="support-customer-meta support-customer-phone"
                              title={userInfo.phoneNumber || userInfo.phone}
                            >
                              {userInfo.phoneNumber || userInfo.phone}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* 🏷 Category */}
                    <div className="categories">
                      <h4>{categoryName}</h4>
                    </div>

                    {/* 💬 Communication Method */}
                    <div className="support-method-badge">
                      {getMethodIcon(methodKey)}
                      <span>
                        {t.support?.contact_methods?.[methodKey] || methodKey}
                      </span>
                    </div>

                    {/* 📌 Status */}
                    <div className="item-status">
                      <span className={`status-badge status-${statusKey}`}>
                        {t.support?.statuses?.[statusKey] || statusKey}
                      </span>
                    </div>

                    {/* 📅 Date */}
                    <div className="date">
                      {formatDate(item.createdAt)}
                    </div>

                    {/* ⚙ Actions */}
                    <div className="actions">
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => {
                          setSelectedTicket(item);
                          setIsDetailsOpen(true);
                        }}
                        title={t.dashboard?.tables?.view || "View"}
                      >
                        <FaEye className="view" />
                      </button>
                      <hr />
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => {
                          setEditingTicket(item);
                          setIsEditOpen(true);
                        }}
                        title={t.dashboard?.tables?.edit || "Edit"}
                      >
                        <MdEdit className="edit" />
                      </button>
                      <hr />
                      <button
                        type="button"
                        className="dash-action-btn"
                        onClick={() => setTicketToDelete(item)}
                        title={t.dashboard?.tables?.delete || "Delete"}
                      >
                        <FaTrashAlt className="delete" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className="table-item"
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px",
                }}
              >
                <div
                  className="holder"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaHeadset
                    size={36}
                    color="var(--paragraph)"
                    style={{ opacity: 0.5 }}
                  />
                  <p
                    className="description"
                    style={{ fontSize: "16px", color: "var(--paragraph)" }}
                  >
                    {t.dashboard?.forms?.noResults ||
                      (locale === "AR"
                        ? "لا توجد تذاكر دعم فني"
                        : "No support tickets found")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {totalCount > limit && (
          <Pagination
            pageCount={pageCount}
            screenSize={screenSize}
            isDashBoard={true}
            onPageChange={(selectedPage) => {
              setPage(selectedPage.selected + 1);
            }}
          />
        )}
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTicket(null);
        }}
        onEdit={(ticketToEdit) => {
          setEditingTicket(ticketToEdit);
          setIsEditOpen(true);
        }}
        canEdit={true}
        categories={categories}
      />

      {/* Ticket Edit Modal (Admin permissions: can edit status too) */}
      <TicketEditModal
        ticket={editingTicket}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTicket(null);
        }}
        onTicketUpdated={(updated) => {
          setTickets((prev) =>
            prev.map((t) =>
              (t._id || t.id) === (updated._id || updated.id) ? updated : t
            )
          );
          if (
            selectedTicket &&
            (selectedTicket._id || selectedTicket.id) === (updated._id || updated.id)
          ) {
            setSelectedTicket(updated);
          }
        }}
        isAdmin={true}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        onConfirm={handleDeleteTicket}
        title={locale === "AR" ? "حذف تذكرة الدعم" : "Delete Support Ticket"}
        message={
          t.support?.messages?.confirm_delete ||
          (locale === "AR"
            ? "هل أنت متأكد من حذف هذه التذكرة؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this ticket? This action cannot be undone.")
        }
        itemName={ticketToDelete?.title}
        loading={!!deletingId}
      />
    </div>
  );
}
