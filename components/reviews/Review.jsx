"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Rating from "@mui/material/Rating";
import { useAuth } from "@/Contexts/AuthContext";
import { createReview } from "@/services/reviews/reviews.service";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/components/reviews.css";

export default function Review({ productId, onReviewAdded }) {
  const t = useTranslate();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [rate, setRate] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rate || !title.trim() || !desc.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createReview({
        rate,
        title: title.trim(),
        desc: desc.trim(),
        type: "Product",
        targetId: productId,
      });
      setSuccess(true);
      setRate(0);
      setTitle("");
      setDesc("");
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="review-login-prompt">
        <p>{t.singelPages.login_to_review || "Please log in to write a review."}</p>
        <Link
          href={`/register?redirect=${encodeURIComponent(pathname || "/")}`}
          className="main-button review-auth-btn"
        >
          {t.auth?.login || t.header?.sign_up || "Log In / Register"}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="review-success-prompt">
        <p>
          {t.singelPages.review_submitted || "Thank you! Your review has been submitted."}
        </p>
        <button
          className="main-button review-another-btn"
          onClick={() => setSuccess(false)}
        >
          {t.singelPages.write_another || "Write another review"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4 className="review-form-title">
        {t.singelPages.write_a_review || "Write a Review"}
      </h4>

      <div className="review-rating-picker">
        <Rating
          name="rating"
          value={rate}
          onChange={(_, newValue) => setRate(newValue)}
          sx={{ color: "#ea8c43", fontSize: "28px" }}
        />
      </div>

      <input
        type="text"
        className="review-input"
        placeholder={t.singelPages.review_title_placeholder || "Review title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="review-textarea"
        placeholder={t.singelPages.review_desc_placeholder || "Write your review..."}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
        rows={4}
      />

      {error && <p className="review-error">{error}</p>}

      <button
        type="submit"
        className="main-button  back-light-animation"
        disabled={submitting || !rate || !title.trim() || !desc.trim()}
      >
        {submitting
          ? (t.dashboard?.forms?.loading || "Loading...")
          : (t.singelPages.submit_review || "Submit Review")}
      </button>
    </form>
  );
}
