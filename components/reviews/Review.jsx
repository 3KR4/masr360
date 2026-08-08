"use client";
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useAuth } from "@/Contexts/AuthContext";
import { createReview } from "@/services/reviews/reviews.service";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/components/reviews.css";

export default function Review({ productId, onReviewAdded }) {
  const t = useTranslate();
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
      <div style={{ padding: "20px", textAlign: "center", boxShadow: "0 1px 5px #0000001a", borderRadius: "10px" }}>
        <p>{t.singelPages.login_to_review || "Please log in to write a review."}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: "20px", textAlign: "center", boxShadow: "0 1px 5px #0000001a", borderRadius: "10px" }}>
        <p style={{ color: "var(--main-color)", fontWeight: 600 }}>
          {t.singelPages.review_submitted || "Thank you! Your review has been submitted."}
        </p>
        <button
          className="main-button"
          onClick={() => setSuccess(false)}
          style={{ marginTop: "10px" }}
        >
          {t.singelPages.write_another || "Write another review"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px",
        boxShadow: "0 1px 5px #0000001a",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h4 style={{ margin: 0, color: "var(--paragraph)" }}>
        {t.singelPages.write_a_review || "Write a Review"}
      </h4>

      <div>
        <Rating
          name="rating"
          value={rate}
          onChange={(_, newValue) => setRate(newValue)}
          sx={{ color: "#ea8c43", fontSize: "28px" }}
        />
      </div>

      <input
        type="text"
        placeholder={t.singelPages.review_title_placeholder || "Review title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: "10px 12px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          fontSize: "14px",
        }}
      />

      <textarea
        placeholder={t.singelPages.review_desc_placeholder || "Write your review..."}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
        rows={4}
        style={{
          padding: "10px 12px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          fontSize: "14px",
          resize: "vertical",
        }}
      />

      {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

      <button
        type="submit"
        className="main-button"
        disabled={submitting || !rate || !title.trim() || !desc.trim()}
        style={{ alignSelf: "flex-start" }}
      >
        {submitting
          ? (t.dashboard.forms.loading || "Loading...")
          : (t.singelPages.submit_review || "Submit Review")}
      </button>
    </form>
  );
}
