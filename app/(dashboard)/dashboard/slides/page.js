"use client";

import React, { useCallback, useContext, useState, useEffect } from "react";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt, FaEye, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import { dashboard } from "@/Contexts/dashboard";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";
import { getAll, remove, update } from "@/services/slides/slides.service";
import DeleteConfirmModal from "@/components/dashboard/DeleteConfirmModal";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";

const DASHBOARD_LIST_IMAGE_PLACEHOLDER = "/images/dashboard-product-placeholder.svg";

function getSafeText(val, locale = "EN") {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    const upper = String(locale || "EN").toUpperCase();
    const lower = String(locale || "EN").toLowerCase();
    const resolved =
      val[upper] ??
      val[lower] ??
      val.EN ??
      val.en ??
      val.AR ??
      val.ar ??
      val.title ??
      val.smallTitle ??
      val.desc ??
      "";
    if (typeof resolved === "string") return resolved;
    if (typeof resolved === "number") return String(resolved);
  }
  return "";
}

export default function Slides() {
  const { locale, screenSize } = useContext(mainContext);
  const { searchText } = useContext(dashboard);
  const t = useTranslate();
  const { addNotification } = useNotification();

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const limit = 6;

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      const { slides: slidesData, totalCount: total } = await getAll(page, limit);
      let list = slidesData || [];

      // Filter by search text if provided
      if (searchText && searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        list = list.filter((s) => {
          const title = getSafeText(s.title).toLowerCase();
          const small = getSafeText(s.smallTitle).toLowerCase();
          const desc = getSafeText(s.desc).toLowerCase();
          const arTitle = getSafeText(s.translations?.AR?.title, "AR").toLowerCase();
          return (
            title.includes(q) ||
            small.includes(q) ||
            desc.includes(q) ||
            arTitle.includes(q)
          );
        });
      }

      setSlides(list);
      setTotalCount(total || list.length);
      setPageCount(Math.max(1, Math.ceil((total || list.length) / limit)));
    } catch (error) {
      console.error("Error fetching slides:", error);
      setSlides([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchText]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const id = itemToDelete._id || itemToDelete.id;
      await remove(id);
      await fetchSlides();
      addNotification({
        type: "success",
        message: locale === "AR" ? "تم حذف السلايد بنجاح" : "Slide has been deleted successfully",
      });
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || (locale === "AR" ? "حدث خطأ ما ❌" : "Something went wrong ❌"),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (slide) => {
    const slideId = slide._id || slide.id;
    const nextStatus = !slide.isActive;
    try {
      setTogglingId(slideId);
      const formData = new FormData();
      formData.append("isActive", String(nextStatus));
      await update(slideId, formData);

      setSlides((prev) =>
        prev.map((s) =>
          (s._id || s.id) === slideId ? { ...s, isActive: nextStatus } : s
        )
      );

      addNotification({
        type: "success",
        message:
          locale === "AR"
            ? `تم ${nextStatus ? "تفعيل" : "إلغاء تفعيل"} السلايد بنجاح`
            : `Slide status updated to ${nextStatus ? "Active" : "Inactive"}`,
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Failed to update slide status",
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container governorates slides">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {locale === "AR" ? "تفاصيل السلايد" : "Slide Details"}
                </div>
                <div className="header-item">
                  {locale === "AR" ? "الرابط" : "Link"}
                </div>
                <div className="header-item">
                  {locale === "AR" ? "الحالة" : "Status"}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                {t.sideNav.slides}
              </div>
            )}
          </div>

          <div className="table-items">
            {slides?.map((item) => {
              const slideId = item?._id || item?.id;
              const imageUrl = item?.image || item?.img?.url || "";
              const localeKey = String(locale || "EN").toUpperCase();

              const slideTitle =
                getSafeText(item?.translations?.[localeKey]?.title, localeKey) ||
                getSafeText(item?.title, localeKey) ||
                getSafeText(item?.translations?.EN?.title, localeKey) ||
                "";

              const slideSmall =
                getSafeText(item?.translations?.[localeKey]?.smallTitle, localeKey) ||
                getSafeText(item?.smallTitle, localeKey) ||
                getSafeText(item?.small, localeKey) ||
                "";

              const slideDesc =
                getSafeText(item?.translations?.[localeKey]?.desc, localeKey) ||
                getSafeText(item?.desc, localeKey) ||
                getSafeText(item?.paragraph, localeKey) ||
                "";

              const slideLink = item?.link || "";

              return (
                <div key={slideId} className="table-item">
                  <div className="holder">
                    <Link
                      href={slideLink || `/dashboard/slides/form?edit=${slideId}`}
                      className="item-image"
                    >
                      <Image
                        src={imageUrl || DASHBOARD_LIST_IMAGE_PLACEHOLDER}
                        alt={slideTitle || "Slide image"}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      {slideSmall ? (
                        <span className="slide-small-tag">{slideSmall}</span>
                      ) : null}
                      <Link
                        href={`/dashboard/slides/form?edit=${slideId}`}
                        className="item-name"
                      >
                        {slideTitle}
                      </Link>
                      <p className="description">{slideDesc}</p>
                    </div>
                  </div>

                  {/* Link cell */}
                  <div className="slide-link-col" style={{ textAlign: "center" }}>
                    {slideLink ? (
                      <Link
                        href={slideLink}
                        target={slideLink.startsWith("http") ? "_blank" : undefined}
                        className="slide-link-cell"
                        title={slideLink}
                      >
                        <FaExternalLinkAlt size={12} />
                        <span className="ellipsis" style={{ maxWidth: "160px" }}>
                          {slideLink}
                        </span>
                      </Link>
                    ) : (
                      <span style={{ color: "var(--paragraph)", opacity: 0.6 }}>—</span>
                    )}
                  </div>

                  {/* Status Toggle Badge */}
                  <div className="slide-status-col" style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className={`status-toggle-btn ${item.isActive ? "active" : "inactive"}`}
                      onClick={() => handleToggleActive(item)}
                      disabled={togglingId === slideId}
                      title={
                        locale === "AR"
                          ? "انقر لتغيير حالة التفعيل"
                          : "Click to toggle active status"
                      }
                    >
                      {item.isActive ? (
                        <>
                          <FaCheckCircle style={{ marginInlineEnd: 5 }} />
                          {locale === "AR" ? "مفعل" : "Active"}
                        </>
                      ) : (
                        <>
                          <FaTimesCircle style={{ marginInlineEnd: 5 }} />
                          {locale === "AR" ? "معطل" : "Inactive"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="actions">
                    {slideLink ? (
                      <Link
                        href={slideLink}
                        target={slideLink.startsWith("http") ? "_blank" : undefined}
                      >
                        <FaEye className="view" title={t.dashboard.tables.view} />
                      </Link>
                    ) : (
                      <Link href={`/dashboard/slides/form?edit=${slideId}`}>
                        <FaEye className="view" title={t.dashboard.tables.view} />
                      </Link>
                    )}
                    <hr />
                    <Link href={`/dashboard/slides/form?edit=${slideId}`}>
                      <MdEdit className="edit" title={t.dashboard.tables.edit} />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => setItemToDelete(item)}
                    />
                  </div>
                </div>
              );
            })}

            {!loading && slides.length === 0 ? (
              <div className="table-item">
                <div className="holder">
                  <div className="item-details">
                    <p className="description">
                      {locale === "AR" ? "لا توجد سلايدات مضافة" : "No slides found"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
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

      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        itemName={
          itemToDelete?.translations?.[String(locale || "EN").toUpperCase()]?.title ||
          itemToDelete?.title ||
          ""
        }
      />
    </div>
  );
}
