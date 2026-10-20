"use client";

import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import { GrTechnology } from "react-icons/gr";
import { FaRegUser, FaWhatsapp, FaPlus, FaHeadset, FaEye, FaTag, FaCalendarAlt } from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import { FaRegCommentDots } from "react-icons/fa6";
import { MdMailOutline, MdEdit } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { LuLayoutGrid } from "react-icons/lu";

import "@/styles/pages/support.css";
import "@/styles/dashboard/forms.css";

import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { useAuth } from "@/Contexts/AuthContext";
import { useNotification } from "@/Contexts/NotificationContext";

import {
  createTicket,
  getAllTickets,
  getSupportCategories,
} from "@/services/support/support.service";
import TicketDetailsModal from "@/components/support/TicketDetailsModal";
import TicketEditModal from "@/components/support/TicketEditModal";

/* ================== DEFAULT FALLBACK DATA ================== */

const DEFAULT_PROBLEM_CATEGORIES = [
  { id: "technical", icon: <GrTechnology /> },
  { id: "account", icon: <FaRegUser /> },
  { id: "payment", icon: <TbCashRegister /> },
  { id: "suggestion", icon: <FaRegCommentDots /> },
  { id: "other", icon: <LuLayoutGrid /> },
];

const CONTACT_METHODS = [
  { id: "whatsapp", icon: <FaWhatsapp /> },
  { id: "email", icon: <MdMailOutline /> },
  { id: "phone", icon: <FiPhone /> },
];

// Helper to choose an icon for dynamically fetched categories
function getIconForCategory(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("tech") || lower.includes("تقن") || lower.includes("system")) {
    return <GrTechnology />;
  }
  if (lower.includes("account") || lower.includes("حساب") || lower.includes("profile")) {
    return <FaRegUser />;
  }
  if (lower.includes("pay") || lower.includes("دفع") || lower.includes("billing") || lower.includes("مال")) {
    return <TbCashRegister />;
  }
  if (lower.includes("suggest") || lower.includes("اقتراح") || lower.includes("feedback")) {
    return <FaRegCommentDots />;
  }
  return <LuLayoutGrid />;
}

/* ================== COMPONENT ================== */

export default function Support() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  // Active tab: "submit" | "my_tickets"
  const [activeTab, setActiveTab] = useState("submit");

  // Category & method states
  const [cat, setCat] = useState("");
  const [method, setMethod] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [contactError, setContactError] = useState("");

  // Guest contact state (only for unauthenticated users)
  const [guestContact, setGuestContact] = useState("");
  const [guestContactError, setGuestContactError] = useState("");

  // Dynamic categories from backend
  const [backendCategories, setBackendCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // User tickets list (for authenticated users)
  const [userTickets, setUserTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /* ================== FETCH CATEGORIES ================== */

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getSupportCategories(locale);
        if (isMounted) {
          setBackendCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load support categories:", err);
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };

    fetchCats();
    return () => {
      isMounted = false;
    };
  }, [locale]);

  /* ================== FETCH USER TICKETS ================== */

  const fetchMyTickets = useCallback(async () => {
    if (!isAuthenticated) {
      setUserTickets([]);
      return;
    }

    try {
      setTicketsLoading(true);
      const res = await getAllTickets({ sort: "createdAt,desc" });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setUserTickets(list);
    } catch (err) {
      console.error("Failed to fetch user tickets:", err);
      setUserTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchMyTickets();
    }
  }, [isAuthenticated, authLoading, fetchMyTickets]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "my_tickets") {
        setActiveTab("my_tickets");
      }
    }
  }, []);

  /* ================== CATEGORIES LIST ================== */

  const displayCategories = useMemo(() => {
    if (backendCategories.length > 0) {
      return backendCategories.map((c) => {
        const id = c._id || c.id;
        const name =
          c.translations?.[locale]?.name ||
          c.name ||
          c.translations?.EN?.name ||
          c.translations?.AR?.name ||
          t.support.categories?.[id] ||
          id;
        return {
          id,
          name,
          icon: getIconForCategory(name),
          raw: c,
        };
      });
    }

    // Fallback to predefined items mapped with translations
    return DEFAULT_PROBLEM_CATEGORIES.map((item) => ({
      id: item.id,
      name: t.support.categories?.[item.id] || item.id,
      icon: item.icon,
    }));
  }, [backendCategories, locale, t.support.categories]);

  /* ================== VALIDATION & SUBMIT ================== */

  // Helper to normalize Arabic-Indic digits (٠-٩) to ASCII (0-9)
  const normalizeDigits = (str) =>
    str ? String(str).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)) : "";

  const validateGuestContact = () => {
    if (isAuthenticated) return { valid: true };

    if (!method) {
      const err = t.support.errors.contact_required;
      setContactError(err);
      return { valid: false, error: err };
    }

    const trimmed = (guestContact || "").trim();
    if (!trimmed) {
      const err =
        method === "email"
          ? t.support.guest_errors.email_required
          : t.support.guest_errors.phone_required;
      setGuestContactError(err);
      return { valid: false, error: err };
    }

    if (method === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        const err = t.support.guest_errors.email_invalid;
        setGuestContactError(err);
        return { valid: false, error: err };
      }
    } else {
      // Phone / whatsapp: accept at least 7-8 digits (supporting Arabic keyboard digits too)
      const phoneDigits = normalizeDigits(trimmed).replace(/[^0-9]/g, "");
      if (phoneDigits.length < 7) {
        const err = t.support.guest_errors.phone_invalid;
        setGuestContactError(err);
        return { valid: false, error: err };
      }
    }

    setGuestContactError("");
    return { valid: true };
  };

  const onInvalid = (fieldErrors) => {
    if (!cat) {
      setCategoryError(t.support.errors.category_required);
    }
    if (!method) {
      setContactError(t.support.errors.contact_required);
    }
    const guestRes = validateGuestContact();

    const firstMsg =
      fieldErrors?.title?.message ||
      fieldErrors?.description?.message ||
      (!cat ? t.support.errors.category_required : null) ||
      (!method ? t.support.errors.contact_required : null) ||
      (!guestRes.valid ? guestRes.error : null) ||
      t.support.errors.title_required;

    addNotification({
      type: "error",
      message: firstMsg,
    });
  };

  const onSubmit = async (data) => {
    if (!cat) {
      const err = t.support.errors.category_required;
      setCategoryError(err);
      addNotification({
        type: "error",
        message: err,
      });
      return;
    }
    if (!method) {
      const err = t.support.errors.contact_required;
      setContactError(err);
      addNotification({
        type: "error",
        message: err,
      });
      return;
    }

    if (!isAuthenticated) {
      const guestRes = validateGuestContact();
      if (!guestRes.valid) {
        addNotification({
          type: "error",
          message: guestRes.error,
        });
        return;
      }
    }

    setCategoryError("");
    setContactError("");
    setGuestContactError("");
    setIsSubmitting(true);

    try {
      const titleClean = (data?.title || "").trim();
      const descClean = (data?.description || "").trim();

      const payload = {
        category: cat,
        title: titleClean,
        desc: descClean,
        communicationMethod: method,
      };

      if (!isAuthenticated) {
        // Guest user: attach guestContact and skip auth header
        const contactClean =
          method === "email"
            ? (guestContact || "").trim()
            : normalizeDigits(guestContact || "").trim();

        payload.guestContact =
          method === "email"
            ? { email: contactClean }
            : { phoneNumber: contactClean };

        const res = await createTicket(payload, true);
        const createdTicket = res?.data || res?.ticket || res;
        const ticketId = createdTicket?._id || createdTicket?.id || "";

        addNotification({
          type: "success",
          message: t.support.messages.ticket_created,
        });

        // Reset form
        reset();
        setCat("");
        setMethod("");
        setGuestContact("");

        if (ticketId) {
          router.push(`/support-success?ticketId=${ticketId}`);
        } else {
          router.push("/support-success");
        }
        return;
      } else {
        // Authenticated user: do not send guestContact
        const res = await createTicket(payload, false);
        const createdTicket = res?.data || res?.ticket || res;
        const ticketId = createdTicket?._id || createdTicket?.id || "";

        addNotification({
          type: "success",
          message: t.support.messages.ticket_created,
        });

        // Reset form
        reset();
        setCat("");
        setMethod("");
        setGuestContact("");

        // Navigate authenticated user to success confirmation page
        if (ticketId) {
          router.push(`/support-success?ticketId=${ticketId}`);
        } else {
          router.push("/support-success");
        }
        return;
      }
    } catch (err) {
      console.error("Failed to submit ticket:", err);
      let apiMsg = t.support.messages.ticket_create_failed;
      if (err?.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          apiMsg = err.response.data.message.join(" - ");
        } else if (typeof err.response.data.message === "string") {
          apiMsg = err.response.data.message;
        } else if (typeof err.response.data.message === "object") {
          apiMsg = Object.values(err.response.data.message).join(" - ");
        }
      } else if (err?.response?.data?.error) {
        apiMsg =
          typeof err.response.data.error === "string"
            ? err.response.data.error
            : JSON.stringify(err.response.data.error);
      } else if (err?.message) {
        apiMsg = err.message;
      }

      addNotification({
        type: "error",
        message: apiMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date helper for ticket cards
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

  // Helper for category display name in ticket card
  const getTicketCategoryName = (ticketCat) => {
    if (ticketCat && typeof ticketCat === "object") {
      return (
        ticketCat.translations?.[locale]?.name ||
        ticketCat.name ||
        ticketCat.translations?.EN?.name ||
        ticketCat.translations?.AR?.name ||
        "—"
      );
    }
    const found = displayCategories.find((c) => c.id === ticketCat);
    if (found) return found.name;
    return ticketCat || "—";
  };

  const getMethodIcon = (m) => {
    switch (m) {
      case "email":
        return <MdMailOutline size={14} />;
      case "phone":
        return <FiPhone size={14} />;
      case "whatsapp":
      default:
        return <FaWhatsapp size={14} />;
    }
  };

  /* ================== UI ================== */

  const selectedCategoryObj = displayCategories.find((item) => item.id === cat);
  const selectedCategoryName = selectedCategoryObj?.name || "";

  return (
    <div className="support">
      {/* Title Header */}
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.support.hero_title}
          <hr />
        </h1>
        <p className="sub-title">{t.support.hero_subtitle}</p>
      </div>

      {/* Tabs for Authenticated Users */}
      {isAuthenticated && (
        <div className="container">
          <div className="support-tabs-holder">
            <button
              type="button"
              className={`support-tab-btn ${activeTab === "submit" ? "active" : ""}`}
              onClick={() => setActiveTab("submit")}
            >
              <FaPlus size={13} />
              {t.support.tabs.submit}
            </button>
            <button
              type="button"
              className={`support-tab-btn ${activeTab === "my_tickets" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("my_tickets");
                fetchMyTickets();
              }}
            >
              <FaHeadset size={14} />
              {t.support.tabs.my_tickets}
              {userTickets.length > 0 && (
                <span className="support-tab-badge">{userTickets.length}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: SUBMIT TICKET FORM */}
      {(!isAuthenticated || activeTab === "submit") && (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="holder container">
          {/* ===== Categories ===== */}
          <div className="hold">
            <h4>{t.support.categories_title}</h4>
            <div
              className="grid"
              style={{
                gridTemplateColumns:
                  displayCategories.length <= 3
                    ? `repeat(${displayCategories.length || 3}, 1fr)`
                    : displayCategories.length === 4
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
              }}
            >
              {displayCategories.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className={`option ${cat === item.id ? "active" : ""}`}
                  onClick={() => {
                    setCat(item.id);
                    setCategoryError("");
                  }}
                >
                  {item.icon}
                  <h5>{item.name}</h5>
                </div>
              ))}
            </div>

            {displayCategories.length > 3 && (
              <div
                className="grid second"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(displayCategories.length - 3, 3)}, 1fr)`,
                }}
              >
                {displayCategories.slice(3).map((item) => (
                  <div
                    key={item.id}
                    className={`option ${cat === item.id ? "active" : ""}`}
                    onClick={() => {
                      setCat(item.id);
                      setCategoryError("");
                    }}
                  >
                    {item.icon}
                    <h5>{item.name}</h5>
                  </div>
                ))}
              </div>
            )}

            {categoryError && (
              <span className="error">
                <CircleAlert size={14} />
                {categoryError}
              </span>
            )}
          </div>

          {/* ===== Description ===== */}
          <div className="hold">
            <h4>{t.support.description_title}</h4>

            {/* Title Field */}
            <div className="box forInput support-field">
              <div className="inputHolder">
                <div className="holder support-holder">
                  <input
                    type="text"
                    id="support-title"
                    aria-label={t.support.description_placeholder_title}
                    {...register("title", {
                      required: t.support.errors.title_required,
                      minLength: {
                        value: 5,
                        message: t.support.errors.title_minLength,
                      },
                    })}
                    placeholder={t.support.description_placeholder_title}
                  />
                </div>
                {errors.title && (
                  <span className="error">
                    <CircleAlert size={14} />
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            {/* Description Textarea Field */}
            <div className="box forInput support-field">
              <div className="inputHolder">
                <div className="holder textarea-holder support-holder">
                  <textarea
                    id="support-description"
                    aria-label={t.support.description_placeholder_details}
                    {...register("description", {
                      required: t.support.errors.desc_required,
                      minLength: {
                        value: 10,
                        message: t.support.errors.desc_minLength,
                      },
                    })}
                    placeholder={t.support.description_placeholder_details}
                    rows={4}
                  />
                </div>
                {errors.description && (
                  <span className="error">
                    <CircleAlert size={14} />
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ===== Contact Method ===== */}
          <div className="hold contact">
            <h4>{t.support.contact_title}</h4>
            <div className="grid">
              {CONTACT_METHODS.map((item) => (
                <div
                  key={item.id}
                  className={`option ${method === item.id ? "active" : ""}`}
                  onClick={() => {
                    setMethod(item.id);
                    setContactError("");
                    setGuestContactError("");
                  }}
                >
                  {item.icon}
                  <h5>{t.support.contact_methods[item.id]}</h5>
                </div>
              ))}
            </div>
            {contactError && (
              <span className="error">
                <CircleAlert size={14} />
                {contactError}
              </span>
            )}
          </div>

          {/* ===== Guest Contact Field (Only if NOT authenticated and method selected) ===== */}
          {!isAuthenticated && method && (
            <div className="guest-contact-box">
              <div className="guest-title">
                {method === "email" ? (
                  <MdMailOutline size={18} />
                ) : (
                  <FiPhone size={16} />
                )}
                <span>{t.support.guest_contact.title}</span>
              </div>
              <p className="guest-subtitle">{t.support.guest_contact.subtitle}</p>

              <div className="box forInput support-field">
                <label htmlFor="guest-contact-input">
                  {method === "email"
                    ? t.support.guest_contact.email_label
                    : t.support.guest_contact.phone_label}
                </label>
                <div className="inputHolder">
                  <div className="holder support-holder">
                    <input
                      type={method === "email" ? "email" : "tel"}
                      id="guest-contact-input"
                      value={guestContact}
                      onChange={(e) => {
                        setGuestContact(e.target.value);
                        if (guestContactError) setGuestContactError("");
                      }}
                      placeholder={
                        method === "email"
                          ? t.support.guest_contact.email_placeholder
                          : t.support.guest_contact.phone_placeholder
                      }
                      dir="ltr"
                    />
                  </div>
                  {guestContactError && (
                    <span className="error">
                      <CircleAlert size={14} />
                      {guestContactError}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== Submit Button ===== */}
          <button
            type="submit"
            className="main-button submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t.support.submit_btn.submitting
              : cat
              ? `${t.support.submit_btn.default} (${selectedCategoryName})`
              : t.support.submit_btn.default}
          </button>
        </form>
      )}

      {/* TAB 2: MY TICKETS (FOR AUTHENTICATED USERS) */}
      {isAuthenticated && activeTab === "my_tickets" && (
        <div className="container">
          {ticketsLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div className="loader" style={{ margin: "0 auto" }} />
            </div>
          ) : userTickets.length === 0 ? (
            <div className="tickets-empty">
              <FaHeadset />
              <h3>{t.support.ticket_list.empty}</h3>
              <p>{t.support.ticket_list.empty_desc}</p>
              <button
                type="button"
                className="main-button"
                style={{
                  height: "44px",
                  padding: "0 24px",
                  borderRadius: "30px",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginTop: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => setActiveTab("submit")}
              >
                <FaPlus size={13} />
                {t.support.tabs.submit}
              </button>
            </div>
          ) : (
            <div className="tickets-grid">
              {userTickets.map((item) => {
                const ticketId = item._id || item.id;
                const statusKey = item.status || "open";
                const isOpen = statusKey === "open";
                const methodKey = item.communicationMethod || "whatsapp";

                return (
                  <div key={ticketId} className="ticket-card">
                    {/* Top Row: ID & Status */}
                    <div className="ticket-card-header">
                      <span className="ticket-tag-id">
                        #{ticketId ? ticketId.slice(-6).toUpperCase() : ""}
                      </span>
                      <span className={`ticket-status-badge status-${statusKey}`}>
                        {t.support.statuses?.[statusKey] || statusKey}
                      </span>
                    </div>

                    {/* Middle: Title & Category */}
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12px",
                          color: "var(--main-color)",
                          fontWeight: 600,
                          marginBottom: "6px",
                        }}
                      >
                        <FaTag size={10} />
                        {getTicketCategoryName(item.category)}
                      </div>
                      <h3 className="ticket-card-title">{item.title}</h3>
                    </div>

                    {/* Description preview */}
                    <p className="ticket-card-desc">{item.desc}</p>

                    {/* Meta: Method & Date */}
                    <div className="ticket-meta-row">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "var(--title-color)",
                          fontWeight: 500,
                        }}
                      >
                        {getMethodIcon(methodKey)}
                        {t.support.contact_methods?.[methodKey] || methodKey}
                      </span>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaCalendarAlt size={11} />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="ticket-card-actions">
                      <button
                        type="button"
                        className="ticket-action-btn"
                        onClick={() => {
                          setSelectedTicket(item);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <FaEye size={13} />
                        {t.support.ticket_list.view_details}
                      </button>

                      {isOpen ? (
                        <button
                          type="button"
                          className="ticket-action-btn primary"
                          onClick={() => {
                            setEditingTicket(item);
                            setIsEditOpen(true);
                          }}
                        >
                          <MdEdit size={14} />
                          {t.support.ticket_list.edit_ticket}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ticket-action-btn"
                          disabled
                          title={t.support.messages.only_open_editable}
                        >
                          <MdEdit size={14} />
                          {t.support.ticket_list.edit_ticket}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
        canEdit={selectedTicket?.status === "open"}
        categories={backendCategories}
      />

      {/* Ticket Edit Modal (Normal User - cannot edit status) */}
      <TicketEditModal
        ticket={editingTicket}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTicket(null);
        }}
        onTicketUpdated={(updated) => {
          setUserTickets((prev) =>
            prev.map((t) =>
              (t._id || t.id) === (updated._id || updated.id) ? updated : t
            )
          );
          if (selectedTicket && (selectedTicket._id || selectedTicket.id) === (updated._id || updated.id)) {
            setSelectedTicket(updated);
          }
        }}
        isAdmin={false}
        categories={backendCategories}
      />
    </div>
  );
}
