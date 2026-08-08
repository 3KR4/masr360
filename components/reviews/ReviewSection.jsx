"use client";
import React, { useContext, useMemo, useState, useCallback, useEffect } from "react";
import Rating from "@mui/material/Rating";
import "@/styles/components/reviews.css";
import { FaStar } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { useAuth } from "@/Contexts/AuthContext";
import { normalizeReview, computeReviewsOverview } from "@/services/normalizers/productNormalizer";
import { getReviews, deleteReview, updateReview } from "@/services/reviews/reviews.service";
import Review from "./Review";
import Pagination from "@/components/settings/Pagination";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ReviewSection({ productId, onReviewAdded }) {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { user } = useAuth();
  const dateLocale = locale === "AR" ? "ar-EG" : "en-US";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editRate, setEditRate] = useState(0);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const limit = 5;

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const result = await getReviews({
        type: "Product",
        targetId: productId,
        sort: "createdAt,desc",
        page,
        limit,
      });
      setReviews(result.reviews || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setPage(1);
  }, [productId]);

  const normalizedReviews = useMemo(() => reviews.map(normalizeReview), [reviews]);
  const overview = useMemo(() => computeReviewsOverview(reviews), [reviews]);
  const hasReviews = reviews.length > 0;

  const reviewFormCb = () => { fetchReviews(); if (onReviewAdded) onReviewAdded(); };

  const handleDelete = async (reviewId) => {
    if (!confirm(t.singelPages.confirm_delete || "Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditRate(review.rate);
    setEditTitle(review.title);
    setEditDesc(review.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRate(0);
    setEditTitle("");
    setEditDesc("");
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editRate || !editTitle.trim() || !editDesc.trim()) return;
    setSaving(true);
    try {
      await updateReview(reviewId, { rate: editRate, title: editTitle.trim(), desc: editDesc.trim() });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="review-section">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.singelPages.Ratings}
          <hr />
        </h1>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <p>{t.dashboard.forms.loading || "Loading..."}</p>
        </div>
      )}

      {!loading && (
        <>
          {hasReviews && (
            <>
              <p className="sub-title" style={{ textAlign: "center" }}>
                {locale === "AR"
                  ? `اقرأ ${overview.totalReviews} تقييمات حقيقية من العملاء الذين اشتروا هذا المنتج وجربوه`
                  : `Read ${overview.totalReviews} real reviews from customers who purchased and tried this product`}
              </p>
              <div className="holder">
                <div className="overview">
                  <h3>{t.sideNav.overview}</h3>
                  <div className="hold">
                    <Rating
                      name="read-only"
                      value={overview.finalRate}
                      precision={0.1}
                      readOnly
                      sx={{ color: "#ea8c43", fontSize: "20px" }}
                    />
                    <span className="count">
                      {overview.finalRate}{" "}
                      {locale === "EN"
                        ? overview.totalReviews === 1
                          ? t.singelPages.star
                          : t.singelPages.stars
                        : t.singelPages.star}
                    </span>
                  </div>
                  <p>
                    {t.singelPages.based_on} {overview.totalReviews}{" "}
                    {overview.totalReviews === 1
                      ? t.dashboard.tables.review
                      : t.dashboard.tables.reviews}
                  </p>
                  <ul className="holder">
                    {Object.entries(overview.rates)
                      .sort((a, b) => b[0] - a[0])
                      .map(([rate, count]) => {
                        const percentage =
                          overview.totalReviews > 0
                            ? ((count / overview.totalReviews) * 100).toFixed(0)
                            : 0;
                        return (
                          <li key={rate}>
                            {rate} <FaStar />
                            <div className="bar">
                              <span
                                className="percentage"
                                style={{ width: `${percentage}%` }}
                              ></span>
                            </div>
                            {percentage}%
                          </li>
                        );
                      })}
                  </ul>
                </div>

                <div className="reviews">
                  {productId && (
                    <Review productId={productId} onReviewAdded={reviewFormCb} />
                  )}

                  {normalizedReviews.map((x) => {
                    const isOwner = user && (user._id === x.userId || user.id === x.userId);
                    const isEditing = editingId === x.id;

                    return (
                      <div className="review" key={x.id}>
                        {screenSize === "large" && (
                          <div className="image left">
                            {getInitials(x.fullName)}
                          </div>
                        )}
                        <div className="hold">
                          <div className="top">
                            {screenSize !== "large" && (
                              <div className="image left">
                                {getInitials(x.fullName)}
                              </div>
                            )}
                            <div className="rowHolder">
                              <h5>{x.fullName}</h5>
                              <p>
                                {new Date(x.date).toLocaleDateString(dateLocale, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {isOwner && !isEditing && (
                              <div className="review-actions">
                                <MdEdit
                                  className="edit"
                                  title={t.dashboard.tables.edit}
                                  onClick={() => startEdit(x)}
                                />
                                <hr />
                                <FaTrashAlt
                                  className="delete"
                                  title={t.dashboard.tables.delete}
                                  onClick={() => handleDelete(x.id)}
                                />
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                              <Rating
                                name="edit-rating"
                                value={editRate}
                                onChange={(_, v) => setEditRate(v)}
                                sx={{ color: "#ea8c43", fontSize: "22px" }}
                              />
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" }}
                              />
                              <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", resize: "vertical" }}
                              />
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  className="main-button"
                                  onClick={() => handleSaveEdit(x.id)}
                                  disabled={saving || !editRate || !editTitle.trim() || !editDesc.trim()}
                                  style={{ padding: "6px 16px", fontSize: "13px" }}
                                >
                                  {saving ? "..." : t.actions.save || "Save"}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  style={{ padding: "6px 16px", fontSize: "13px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}
                                >
                                  {t.actions.cancel || "Cancel"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="rate">
                                <Rating
                                  name="read-only"
                                  value={x.rate}
                                  precision={0.1}
                                  readOnly
                                  sx={{ color: "#ea8c43", fontSize: "18px" }}
                                />
                                <span className="count">
                                  ({x.rate}){" "}
                                  {locale === "EN"
                                    ? overview.totalReviews === 1
                                      ? t.singelPages.star
                                      : t.singelPages.stars
                                    : t.singelPages.star}
                                </span>
                              </div>
                              <h4>{x.title}</h4>
                              <p>{x.text}</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {total > limit && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                      <Pagination
                        pageCount={Math.ceil(total / limit)}
                        screenSize={screenSize}
                        onPageChange={handlePageChange}
                        forcePage={page - 1}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!hasReviews && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <p style={{ fontSize: "16px", color: "#666", fontWeight: 500 }}>
                {t.singelPages.no_reviews || "No reviews yet. Be the first to review!"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
