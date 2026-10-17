"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaSave,
  FaExclamationCircle,
  FaRoad,
  FaHome,
  FaMapMarkedAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { CircleAlert } from "lucide-react";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";
import { getOrder, updateOrder } from "@/services/orders/orders.service";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { EGYPT_CITIES } from "@/constants/egyptCities";
import "@/styles/components/order-details-modal.css";
import "@/styles/dashboard/edit-order-modal.css";

const STATUS_RAW = [
  { value: "pending", labelEn: "Pending", labelAr: "قيد الانتظار" },
  { value: "confirmed", labelEn: "Confirmed", labelAr: "مؤكد" },
  { value: "processing", labelEn: "Processing", labelAr: "قيد المعالجة" },
  { value: "shipped", labelEn: "Shipped", labelAr: "تم الشحن" },
  { value: "delivered", labelEn: "Delivered", labelAr: "تم التوصيل" },
  { value: "cancelled", labelEn: "Cancelled", labelAr: "ملغي" },
];

const PAYMENT_STATUS_RAW = [
  { value: "pending", labelEn: "Pending", labelAr: "قيد الانتظار" },
  { value: "paid", labelEn: "Paid", labelAr: "تم الدفع" },
  { value: "failed", labelEn: "Failed", labelAr: "فشل" },
  { value: "refunded", labelEn: "Refunded", labelAr: "مسترجع" },
];

const PAYMENT_METHOD_RAW = [
  { value: "cash", labelEn: "Cash on Delivery", labelAr: "كاش عند الاستلام" },
  { value: "card", labelEn: "Credit / Debit Card", labelAr: "بطاقة ائتمان" },
  { value: "wallet", labelEn: "Wallet / Vodafone Cash", labelAr: "محفظة إلكترونية" },
];

function formatDateForInput(dateVal) {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
}

export default function EditOrderModal({
  orderId,
  isOpen,
  onClose,
  onOrderUpdated,
}) {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const { addNotification } = useNotification();
  const isAr = locale === "AR";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Form setup matching Cart & Checkout page
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      orderStatus: "pending",
      paymentStatus: "pending",
      paymentMethod: "cash",
      date: "",
      city: "",
      street: "",
      home: "",
      fullAddress: "",
      googleMapsLink: "",
    },
  });

  // Watch field values for custom SelectOptions
  const currentOrderStatus = watch("orderStatus");
  const currentPaymentStatus = watch("paymentStatus");
  const currentPaymentMethod = watch("paymentMethod");
  const currentCity = watch("city");

  // Options formatted for SelectOptions component
  const statusOptions = useMemo(() => {
    return STATUS_RAW.map((s) => ({
      id: s.value,
      name: isAr ? s.labelAr : s.labelEn,
      value: s.value,
    }));
  }, [isAr]);

  const paymentStatusOptions = useMemo(() => {
    return PAYMENT_STATUS_RAW.map((p) => ({
      id: p.value,
      name: isAr ? p.labelAr : p.labelEn,
      value: p.value,
    }));
  }, [isAr]);

  const paymentMethodOptions = useMemo(() => {
    return PAYMENT_METHOD_RAW.map((m) => ({
      id: m.value,
      name: isAr ? m.labelAr : m.labelEn,
      value: m.value,
    }));
  }, [isAr]);

  const cityOptions = useMemo(() => {
    const baseOptions = EGYPT_CITIES.map((c) => ({
      id: c.value,
      name: isAr ? c.labelAr : c.labelEn,
      value: c.value,
    }));

    // If existing city from DB is not in the list, keep it selectable
    if (
      currentCity &&
      !baseOptions.some(
        (c) => c.value.toLowerCase() === String(currentCity).toLowerCase()
      )
    ) {
      baseOptions.unshift({
        id: currentCity,
        name: currentCity,
        value: currentCity,
      });
    }

    return baseOptions;
  }, [isAr, currentCity]);

  // Selected option objects for SelectOptions
  const selectedStatus = useMemo(() => {
    return statusOptions.find((s) => s.value === currentOrderStatus) || null;
  }, [statusOptions, currentOrderStatus]);

  const selectedPaymentStatus = useMemo(() => {
    return (
      paymentStatusOptions.find((p) => p.value === currentPaymentStatus) || null
    );
  }, [paymentStatusOptions, currentPaymentStatus]);

  const selectedPaymentMethod = useMemo(() => {
    return (
      paymentMethodOptions.find((m) => m.value === currentPaymentMethod) || null
    );
  }, [paymentMethodOptions, currentPaymentMethod]);

  const selectedCity = useMemo(() => {
    return cityOptions.find((c) => c.value === currentCity) || null;
  }, [cityOptions, currentCity]);

  // Register validation rules matching Cart page
  useEffect(() => {
    register("orderStatus", {
      required: isAr ? "حالة الطلب مطلوبة" : "Order status is required",
    });
    register("paymentStatus", {
      required: isAr ? "حالة الدفع مطلوبة" : "Payment status is required",
    });
    register("paymentMethod", {
      required: isAr ? "طريقة الدفع مطلوبة" : "Payment method is required",
    });
    register("city", {
      required: t.cart?.cityRequired || (isAr ? "يرجى اختيار مدينتك" : "Please select your city"),
    });
  }, [register, isAr, t.cart?.cityRequired]);

  // Fetch single order data when modal opens
  useEffect(() => {
    if (!isOpen || !orderId) return;

    let isMounted = true;
    const fetchOrderData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await getOrder(orderId);
        const data = res?.data || res;
        if (!isMounted) return;

        reset({
          orderStatus: data.orderStatus || "pending",
          paymentStatus: data.paymentStatus || "pending",
          paymentMethod: data.paymentMethod || "cash",
          date: formatDateForInput(data.date || data.createdAt),
          city: data.location?.city || "",
          street: data.location?.street || "",
          home: data.location?.home || "",
          fullAddress: data.location?.fullAddress || "",
          googleMapsLink: data.location?.googleMapsLink || "",
        });
      } catch (err) {
        console.error("Failed to load order for edit:", err);
        if (isMounted) {
          setFetchError(
            err.response?.data?.message ||
              (isAr ? "فشل في تحميل بيانات الطلب" : "Failed to load order details")
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrderData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, orderId, reset, isAr]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, saving, onClose]);

  if (!isOpen || !orderId) return null;

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      let parsedDate;
      if (formData.date) {
        const d = new Date(formData.date);
        parsedDate = !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
      } else {
        parsedDate = new Date().toISOString();
      }

      const payload = {
        orderStatus: formData.orderStatus,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod,
        date: parsedDate,
        location: {
          street: formData.street?.trim() || "",
          fullAddress: formData.fullAddress?.trim() || "",
          home: formData.home?.trim() || "",
          city: formData.city?.trim() || "",
          googleMapsLink: formData.googleMapsLink?.trim() || "",
        },
      };

      const res = await updateOrder(orderId, payload);
      const updatedOrder = res?.data || { _id: orderId, ...payload };

      addNotification({
        type: "success",
        message: isAr
          ? "تم تحديث الطلب بنجاح"
          : "Order updated successfully",
      });

      if (onOrderUpdated) {
        onOrderUpdated(updatedOrder);
      }
      onClose?.();
    } catch (err) {
      console.error("Failed to update order:", err);
      addNotification({
        type: "error",
        message:
          err.response?.data?.message ||
          (isAr ? "فشل في تحديث الطلب" : "Failed to update order"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="order-details-overlay"
      onClick={() => !saving && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-order-title"
    >
      <div
        className="order-details-modal edit-order-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-details-header">
          <div className="order-details-header-left">
            <h2 id="edit-order-title" className="order-details-title">
              {isAr ? "تعديل الطلب" : "Edit Order"}
            </h2>
            <span className="order-id-badge">
              #{String(orderId).slice(-8).toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            className="order-details-close-btn"
            onClick={onClose}
            disabled={saving}
            aria-label={t.orders?.close || "Close"}
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="edit-order-loading-container">
            <div className="loader" />
            <p style={{ margin: 0, color: "var(--paragraph)" }}>
              {isAr ? "جاري تحميل بيانات الطلب..." : "Loading order details..."}
            </p>
          </div>
        ) : fetchError ? (
          <div className="edit-order-loading-container">
            <FaExclamationCircle size={36} style={{ color: "#e74c3c" }} />
            <p style={{ margin: 0, color: "#e74c3c" }}>{fetchError}</p>
            <button
              type="button"
              className="edit-order-btn-cancel"
              onClick={onClose}
              style={{ marginTop: "12px" }}
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <form className="edit-order-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="edit-order-body">
              {/* SECTION 1: ORDER DETAILS */}
              <div className="edit-order-section">
                <h3 className="edit-order-section-title">
                  <FaShoppingBag />
                  {isAr ? "تفاصيل الطلب" : "Order Details"}
                </h3>

                <div className="edit-order-fields-grid">
                  {/* Order Status - SelectOptions */}
                  <SelectOptions
                    label={isAr ? "حالة الطلب" : "Order Status"}
                    placeholder={isAr ? "اختر حالة الطلب" : "Select order status"}
                    options={statusOptions}
                    value={selectedStatus}
                    disabled={saving}
                    onChange={(item) => {
                      setValue("orderStatus", item.value, { shouldValidate: true });
                      clearErrors("orderStatus");
                    }}
                    error={errors.orderStatus?.message}
                  />

                  {/* Payment Status - SelectOptions */}
                  <SelectOptions
                    label={isAr ? "حالة الدفع" : "Payment Status"}
                    placeholder={isAr ? "اختر حالة الدفع" : "Select payment status"}
                    options={paymentStatusOptions}
                    value={selectedPaymentStatus}
                    disabled={saving}
                    onChange={(item) => {
                      setValue("paymentStatus", item.value, { shouldValidate: true });
                      clearErrors("paymentStatus");
                    }}
                    error={errors.paymentStatus?.message}
                  />

                  {/* Payment Method - SelectOptions */}
                  <SelectOptions
                    label={isAr ? "طريقة الدفع" : "Payment Method"}
                    placeholder={isAr ? "اختر طريقة الدفع" : "Select payment method"}
                    options={paymentMethodOptions}
                    value={selectedPaymentMethod}
                    disabled={saving}
                    onChange={(item) => {
                      setValue("paymentMethod", item.value, { shouldValidate: true });
                      clearErrors("paymentMethod");
                    }}
                    error={errors.paymentMethod?.message}
                  />

                  {/* Date - with Validation & Icon */}
                  <div className="box forInput">
                    <label htmlFor="date">
                      {isAr ? "تاريخ الطلب" : "Order Date"}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <FaCalendarAlt />
                        <input
                          type="datetime-local"
                          id="date"
                          disabled={saving}
                          {...register("date", {
                            required: isAr
                              ? "يرجى تحديد تاريخ الطلب"
                              : "Order date is required",
                          })}
                        />
                      </div>
                      {errors.date && (
                        <span className="error">
                          <CircleAlert size={14} />
                          {errors.date.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LOCATION */}
              <div className="edit-order-section">
                <h3 className="edit-order-section-title">
                  <FaMapMarkerAlt />
                  {isAr ? "الموقع" : "Location"}
                </h3>

                <div className="edit-order-fields-grid">
                  {/* City - SelectOptions with EGYPT_CITIES (exact Cart page validation) */}
                  <SelectOptions
                    label={t.cart?.city || (isAr ? "المدينة" : "City")}
                    placeholder={t.cart?.selectCity || (isAr ? "اختر المدينة" : "Select City")}
                    options={cityOptions}
                    value={selectedCity}
                    disabled={saving}
                    onChange={(item) => {
                      setValue("city", item.value, { shouldValidate: true });
                      clearErrors("city");
                    }}
                    error={errors.city?.message}
                  />

                  {/* Street - matching Cart page validation & icon */}
                  <div className="box forInput">
                    <label htmlFor="street">
                      {t.cart?.street || (isAr ? "الشارع" : "Street")}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <FaRoad />
                        <input
                          type="text"
                          id="street"
                          disabled={saving}
                          {...register("street", {
                            required: t.cart?.streetRequired || (isAr ? "يرجى إدخال اسم الشارع" : "Please enter street name"),
                          })}
                          placeholder={t.cart?.streetPlaceholder || (isAr ? "مثال: شارع 26 يوليو" : "e.g. 26 July St")}
                        />
                      </div>
                      {errors.street && (
                        <span className="error">
                          <CircleAlert size={14} />
                          {errors.street.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Home / Apt - matching Cart page validation & icon */}
                  <div className="box forInput">
                    <label htmlFor="home">
                      {t.cart?.home || (isAr ? "الشقة / العمارة" : "Home / Apt")}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <FaHome />
                        <input
                          type="text"
                          id="home"
                          disabled={saving}
                          {...register("home", {
                            required: t.cart?.homeRequired || (isAr ? "يرجى إدخال بيانات الشقة أو العمارة" : "Please enter apartment or building info"),
                          })}
                          placeholder={t.cart?.homePlaceholder || (isAr ? "مثال: شقة 12، الدور 3" : "e.g. Apt 12, Floor 3")}
                        />
                      </div>
                      {errors.home && (
                        <span className="error">
                          <CircleAlert size={14} />
                          {errors.home.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Google Maps Link - matching Cart page validation & regex */}
                  <div className="box forInput">
                    <label htmlFor="googleMapsLink">
                      {t.cart?.googleMapsLink || (isAr ? "رابط خرائط جوجل" : "Google Maps Link")}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <FaMapMarkedAlt />
                        <input
                          type="text"
                          id="googleMapsLink"
                          disabled={saving}
                          {...register("googleMapsLink", {
                            validate: (val) => {
                              if (!val || !val.trim()) return true;
                              const trimmed = val.trim();
                              const urlPattern =
                                /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
                              if (!urlPattern.test(trimmed)) {
                                return (
                                  t.cart?.googleMapsLinkInvalid ||
                                  (isAr
                                    ? "يجب أن يكون الرابط صحيحاً"
                                    : "Google Maps link must be a valid URL")
                                );
                              }
                              try {
                                new URL(
                                  trimmed.startsWith("http://") ||
                                    trimmed.startsWith("https://")
                                    ? trimmed
                                    : `https://${trimmed}`
                                );
                                return true;
                              } catch {
                                return (
                                  t.cart?.googleMapsLinkInvalid ||
                                  (isAr
                                    ? "يجب أن يكون الرابط صحيحاً"
                                    : "Google Maps link must be a valid URL")
                                );
                              }
                            },
                          })}
                          placeholder={
                            t.cart?.googleMapsLinkPlaceholder ||
                            "https://maps.google.com/?q=..."
                          }
                        />
                      </div>
                      {errors.googleMapsLink && (
                        <span className="error">
                          <CircleAlert size={14} />
                          {errors.googleMapsLink.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Full Address - matching Cart page validation & icon */}
                  <div className="box forInput full-width">
                    <label htmlFor="fullAddress">
                      {t.cart?.fullAddress || (isAr ? "العنوان بالكامل" : "Full Address")}
                    </label>
                    <div className="inputHolder">
                      <div className="holder">
                        <SlLocationPin />
                        <input
                          type="text"
                          id="fullAddress"
                          disabled={saving}
                          {...register("fullAddress", {
                            required:
                              t.cart?.fullAddressRequired ||
                              (isAr
                                ? "يرجى إدخال العنوان بالكامل"
                                : "Please enter complete full address"),
                          })}
                          placeholder={
                            t.cart?.fullAddressPlaceholder ||
                            (isAr
                              ? "مثال: 26 شارع يوليو، عمارة 5، شقة 12، الزمالك، القاهرة"
                              : "e.g. 26 July St, Building 5, Apt 12, Zamalek, Cairo")
                          }
                        />
                      </div>
                      {errors.fullAddress && (
                        <span className="error">
                          <CircleAlert size={14} />
                          {errors.fullAddress.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="edit-order-footer">
              <button
                type="button"
                className="edit-order-btn-cancel"
                onClick={onClose}
                disabled={saving}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="edit-order-btn-save"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="edit-order-spinner" />
                    <span>{isAr ? "جاري الحفظ..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
