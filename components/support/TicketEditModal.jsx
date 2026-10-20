"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CircleAlert } from "lucide-react";
import { FaSave } from "react-icons/fa";

import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";
import { updateTicket } from "@/services/support/support.service";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import "@/styles/components/order-details-modal.css";

const STATUS_RAW = [
  { value: "open", labelKey: "open" },
  { value: "in_progress", labelKey: "in_progress" },
  { value: "on_hold", labelKey: "on_hold" },
  { value: "closed", labelKey: "closed" },
];

export default function TicketEditModal({
  ticket,
  isOpen,
  onClose,
  onTicketUpdated,
  isAdmin = false,
  categories = [],
}) {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const { addNotification } = useNotification();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("open");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !ticket) return;

    setTitle(ticket.title || "");
    setDesc(ticket.desc || "");

    const catId =
      ticket.category && typeof ticket.category === "object"
        ? ticket.category._id || ticket.category.id
        : ticket.category || "";
    setCategory(catId);

    setStatus(ticket.status || "open");
    setErrors({});
    setSaving(false);
  }, [isOpen, ticket]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, saving, onClose]);

  // Category options for SelectOptions component
  const categoryOptions = useMemo(() => {
    return categories.map((c) => {
      const cId = c._id || c.id;
      const cName =
        c.translations?.[locale]?.name ||
        c.name ||
        c.translations?.EN?.name ||
        c.translations?.AR?.name ||
        t.support?.categories?.[cId] ||
        cId;
      return {
        id: cId,
        value: cId,
        name: cName,
      };
    });
  }, [categories, locale, t.support?.categories]);

  const selectedCategoryObj = useMemo(() => {
    if (!category) return null;
    return categoryOptions.find((c) => c.value === category) || null;
  }, [category, categoryOptions]);

  // Status options for SelectOptions component
  const statusOptions = useMemo(() => {
    return STATUS_RAW.map((opt) => ({
      id: opt.value,
      value: opt.value,
      name: t.support?.statuses?.[opt.labelKey] || opt.value,
    }));
  }, [t.support?.statuses]);

  const selectedStatusObj = useMemo(() => {
    if (!status) return null;
    return statusOptions.find((s) => s.value === status) || null;
  }, [status, statusOptions]);

  if (!isOpen || !ticket) return null;

  // Validation
  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = t.support.errors.title_required;
    } else if (title.trim().length < 5) {
      errs.title = t.support.errors.title_minLength;
    }

    if (!desc.trim()) {
      errs.desc = t.support.errors.desc_required;
    }

    if (!category) {
      errs.category = t.support.errors.category_required;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        desc: desc.trim(),
        category,
      };

      // STRICT RULE: Normal users MUST NOT send status!
      if (isAdmin) {
        payload.status = status;
      }

      const ticketId = ticket._id || ticket.id;
      const res = await updateTicket(ticketId, payload);

      addNotification({
        type: "success",
        message: t.support.messages.ticket_updated,
      });

      onTicketUpdated?.(res?.data || { ...ticket, ...payload });
      onClose?.();
    } catch (err) {
      console.error("Failed to update ticket:", err);
      const apiMessage =
        err?.response?.data?.message || t.support.messages.ticket_update_failed;
      addNotification({
        type: "error",
        message: apiMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="order-details-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose?.();
      }}
    >
      <div
        className="order-details-modal support-ticket-modal"
        style={{ maxWidth: "600px", width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-details-header">
          <div className="order-details-header-left">
            <span className="order-details-tag">
              #{ticket._id ? ticket._id.slice(-6).toUpperCase() : ticket.id || ""}
            </span>
            <div className="order-details-title-wrap">
              <h3 className="order-details-title">{t.support.ticket_list.edit_ticket}</h3>
            </div>
          </div>
          <button
            type="button"
            className="order-details-close-btn"
            onClick={onClose}
            disabled={saving}
            aria-label={t.support.ticket_list.cancel}
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Form Body - Matching cart & checkout input boxes */}
        <form onSubmit={handleSubmit}>
          <div
            className="order-details-body support-modal-body"
            style={{ padding: "24px 28px", maxHeight: "72vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Title field - .box.forInput */}
            <div className="box forInput support-field">
              <label htmlFor="edit-ticket-title">
                {t.support.description_placeholder_title}
              </label>
              <div className="inputHolder">
                <div className="holder support-holder">
                  <input
                    type="text"
                    id="edit-ticket-title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((p) => ({ ...p, title: null }));
                    }}
                    placeholder={t.support.description_placeholder_title}
                  />
                </div>
                {errors.title && (
                  <span className="error">
                    <CircleAlert size={14} />
                    {errors.title}
                  </span>
                )}
              </div>
            </div>

            {/* Category Select - SelectOptions */}
            <SelectOptions
              label={t.support.ticket_list.category}
              placeholder={t.support.ticket_list.filter_category || "Select Category"}
              options={categoryOptions}
              value={selectedCategoryObj}
              disabled={saving}
              className="support-select-options"
              onChange={(item) => {
                setCategory(item.id || item.value);
                if (errors.category) setErrors((p) => ({ ...p, category: null }));
              }}
              error={errors.category}
            />

            {/* Admin only: Status Field - SelectOptions */}
            {isAdmin && (
              <SelectOptions
                label={t.support.ticket_list.status}
                placeholder={t.support.ticket_list.filter_status || "Select Status"}
                options={statusOptions}
                value={selectedStatusObj}
                disabled={saving}
                className="support-select-options"
                onChange={(item) => {
                  setStatus(item.id || item.value);
                }}
              />
            )}

            {/* Description textarea - .box.forInput */}
            <div className="box forInput support-field">
              <label htmlFor="edit-ticket-desc">
                {t.support.description_placeholder_details}
              </label>
              <div className="inputHolder">
                <div className="holder textarea-holder support-holder">
                  <textarea
                    id="edit-ticket-desc"
                    value={desc}
                    onChange={(e) => {
                      setDesc(e.target.value);
                      if (errors.desc) setErrors((p) => ({ ...p, desc: null }));
                    }}
                    placeholder={t.support.description_placeholder_details}
                    rows={5}
                  />
                </div>
                {errors.desc && (
                  <span className="error">
                    <CircleAlert size={14} />
                    {errors.desc}
                  </span>
                )}
              </div>
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
            <button
              type="button"
              style={{
                height: "40px",
                padding: "0 20px",
                borderRadius: "30px",
                background: "transparent",
                border: "1px solid var(--second-color)",
                color: "var(--paragraph)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={onClose}
              disabled={saving}
            >
              {t.support.ticket_list.cancel}
            </button>

            <button
              type="submit"
              className="main-button"
              style={{
                height: "40px",
                padding: "0 24px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              disabled={saving}
            >
              <FaSave size={15} />
              {saving ? t.support.ticket_list.saving : t.support.ticket_list.save_changes}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
