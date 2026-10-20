"use client";

import React, { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaWhatsapp, FaRegUser, FaUserClock, FaCalendarAlt, FaTag } from "react-icons/fa";
import { MdMailOutline, MdEdit } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { GrTechnology } from "react-icons/gr";
import { TbCashRegister } from "react-icons/tb";
import { FaRegCommentDots } from "react-icons/fa6";
import { LuLayoutGrid } from "react-icons/lu";

import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/components/order-details-modal.css";

export default function TicketDetailsModal({
  ticket,
  isOpen,
  onClose,
  onEdit,
  canEdit = false,
  categories = [],
}) {
  const { locale } = useContext(mainContext);
  const t = useTranslate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const dateLocale = locale === "AR" ? "ar-EG" : "en-US";

  // Format date helper
  const formatDate = (dateVal) => {
    if (!dateVal) return "—";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // Category name resolver
  const getCategoryName = () => {
    if (ticket.category && typeof ticket.category === "object") {
      const catObj = ticket.category;
      return (
        catObj.translations?.[locale]?.name ||
        catObj.name ||
        catObj.translations?.EN?.name ||
        catObj.translations?.AR?.name ||
        "—"
      );
    }
    const catId = ticket.category;
    const found = categories.find((c) => c._id === catId || c.id === catId);
    if (found) {
      return (
        found.translations?.[locale]?.name ||
        found.name ||
        found.translations?.EN?.name ||
        found.translations?.AR?.name ||
        "—"
      );
    }
    // Check translation key fallback
    if (t.support.categories?.[catId]) {
      return t.support.categories[catId];
    }
    return catId || "—";
  };

  // Status label & badge style
  const statusKey = ticket.status || "open";
  const statusLabel =
    t.support.statuses?.[statusKey] || statusKey.replace("_", " ");

  // Method icon & label
  const methodKey = ticket.communicationMethod || "whatsapp";
  const methodLabel =
    t.support.contact_methods?.[methodKey] || methodKey;

  const getMethodIcon = () => {
    switch (methodKey) {
      case "email":
        return <MdMailOutline />;
      case "phone":
        return <FiPhone />;
      case "whatsapp":
      default:
        return <FaWhatsapp />;
    }
  };

  // Submitter details
  const userInfo = ticket.userInfo || (typeof ticket.user === "object" ? ticket.user : null);
  const isGuest = !userInfo;
  const guestContact = ticket.guestContact || {};
  const user = userInfo || {};

  return (
    <div
      className="order-details-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="order-details-modal support-ticket-modal"
        style={{ maxWidth: "620px", width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-details-header">
          <div className="order-details-header-left">
            <span className="order-details-tag">
              #{ticket._id ? ticket._id.slice(-6).toUpperCase() : ticket.id || ""}
            </span>
            <div className="order-details-title-wrap">
              <h3 className="order-details-title">{ticket.title}</h3>
            </div>
          </div>
          <button
            type="button"
            className="order-details-close-btn"
            onClick={onClose}
            aria-label={t.support.ticket_list.close_modal || "Close"}
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="order-details-body"
          style={{ padding: "24px 28px", maxHeight: "75vh", overflowY: "auto" }}
        >
          {/* Status & Category Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingBottom: "18px",
              marginBottom: "20px",
              borderBottom: "1px solid var(--box-shadow-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className={`ticket-status-badge status-${statusKey}`}>
                {statusLabel}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "var(--section-color)",
                  color: "var(--paragraph)",
                  border: "1px solid var(--second-color)",
                }}
              >
                <FaTag size={11} color="var(--main-color)" />
                {getCategoryName()}
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "var(--main-color)",
                fontWeight: 600,
              }}
            >
              {getMethodIcon()}
              <span>{methodLabel}</span>
            </div>
          </div>

          {/* Submitter info */}
          <div
            style={{
              background: "var(--section-color)",
              border: "1px solid var(--second-color)",
              borderRadius: "16px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--main-color)",
                fontWeight: 700,
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaRegUser size={12} />
              {t.support.ticket_list.submitter}: {isGuest ? t.support.ticket_list.guest : t.support.ticket_list.user}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "13px" }}>
              {isGuest ? (
                <>
                  {guestContact.email && (
                    <div>
                      <span style={{ color: "var(--paragraph)" }}>{t.support.ticket_list.email}: </span>
                      <strong style={{ color: "var(--title-color)" }}>{guestContact.email}</strong>
                    </div>
                  )}
                  {guestContact.phoneNumber && (
                    <div>
                      <span style={{ color: "var(--paragraph)" }}>{t.support.ticket_list.phone}: </span>
                      <strong style={{ color: "var(--title-color)" }}>{guestContact.phoneNumber}</strong>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <span style={{ color: "var(--paragraph)" }}>{t.support.ticket_list.submitter}: </span>
                    <strong style={{ color: "var(--title-color)" }}>{user.username || user.name || user.fullName || "—"}</strong>
                  </div>
                  {user.email && (
                    <div>
                      <span style={{ color: "var(--paragraph)" }}>{t.support.ticket_list.email}: </span>
                      <strong style={{ color: "var(--title-color)" }}>{user.email}</strong>
                    </div>
                  )}
                  {(user.phoneNumber || user.phone) && (
                    <div>
                      <span style={{ color: "var(--paragraph)" }}>{t.support.ticket_list.phone}: </span>
                      <strong style={{ color: "var(--title-color)" }} dir="ltr">{user.phoneNumber || user.phone}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "22px" }}>
            <h4
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--paragraph)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              {t.support.ticket_list.desc}
            </h4>
            <div
              style={{
                background: "var(--section-color)",
                border: "1px solid var(--second-color)",
                borderRadius: "16px",
                padding: "16px 20px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "var(--title-color)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {ticket.desc || "—"}
            </div>
          </div>

          {/* Timestamps */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              fontSize: "12px",
              color: "var(--paragraph)",
              paddingTop: "14px",
              borderTop: "1px solid var(--box-shadow-2)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaCalendarAlt size={12} color="var(--main-color)" />
              {t.support.ticket_list.date}: {formatDate(ticket.createdAt)}
            </span>
            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <FaUserClock size={12} />
                {formatDate(ticket.updatedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "16px 28px",
            borderTop: "1px solid var(--box-shadow-2)",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          {canEdit && (
            <button
              type="button"
              className="main-button"
              style={{
                height: "40px",
                padding: "0 18px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={() => {
                onClose?.();
                onEdit?.(ticket);
              }}
            >
              <MdEdit size={16} />
              {t.support.ticket_list.edit_ticket}
            </button>
          )}

          <button
            type="button"
            style={{
              height: "40px",
              padding: "0 18px",
              borderRadius: "30px",
              background: "transparent",
              border: "1px solid var(--second-color)",
              color: "var(--paragraph)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            {t.support.ticket_list.close_modal || t.support.ticket_list.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
