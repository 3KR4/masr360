"use client";

import React, { useContext, useEffect } from "react";
import { FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import "@/styles/pages/tables.css";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName = "",
  loading = false,
}) {
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="order-modal-overlay"
      onClick={() => !loading && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="order-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "460px",
          width: "90%",
          padding: "28px 24px 24px",
          borderRadius: "24px",
          background: "var(--section-color)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Warning Icon with subtle glow */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "rgba(217, 68, 82, 0.14)",
            border: "1px solid rgba(217, 68, 82, 0.35)",
            color: "#d94452",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          <FaTrashAlt />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "19px",
            fontWeight: 800,
            color: "var(--title-color)",
            marginBottom: "8px",
          }}
        >
          {title || (isAr ? "تأكيد الحذف" : "Confirm Deletion")}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--paragraph)",
            lineHeight: "1.6",
            margin: "0 0 16px 0",
          }}
        >
          {message ||
            (isAr
              ? "هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء."
              : "Are you sure you want to delete this item? This action cannot be undone.")}
        </p>

        {/* Highlighted item name if provided */}
        {itemName && (
          <div
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              background: "var(--body-color)",
              border: "1px solid var(--second-color)",
              color: "var(--main-color)",
              fontWeight: 700,
              fontSize: "13.5px",
              marginBottom: "20px",
              wordBreak: "break-word",
            }}
          >
            {itemName}
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="modal-actions"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "6px",
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "30px",
              fontWeight: 600,
              fontSize: "13.5px",
              cursor: "pointer",
            }}
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>

          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "30px",
              fontWeight: 700,
              fontSize: "13.5px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <span>{isAr ? "جارٍ الحذف..." : "Deleting..."}</span>
            ) : (
              <span>{isAr ? "نعم، حذف" : "Yes, Delete"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
