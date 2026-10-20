"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Rating from "@mui/material/Rating";
import { useAuth } from "@/Contexts/AuthContext";
import { mainContext } from "@/Contexts/mainContext";
import { createReview } from "@/services/reviews/reviews.service";
import useTranslate from "@/Contexts/useTranslation";
import { CircleAlert } from "lucide-react";
import "@/styles/forms.css";
import "@/styles/components/reviews.css";

export default function Review({ productId, onReviewAdded }) {
  const t = useTranslate();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { locale } = useContext(mainContext);

  const [rate, setRate] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [rateError, setRateError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!rate || rate === 0) {
      setRateError(
        t.singelPages?.rating_required ||
          (locale === "AR"
            ? "يرجى اختيار عدد النجوم أولاً"
            : "Please select a star rating first")
      );
      hasError = true;
    } else {
      setRateError("");
    }

    if (!title.trim()) {
      setTitleError(
        t.singelPages?.title_required ||
          (locale === "AR"
            ? "يرجى إدخال عنوان التقييم"
            : "Please enter a review title")
      );
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!desc.trim()) {
      setDescError(
        t.singelPages?.desc_required ||
          (locale === "AR"
            ? "يرجى كتابة نص التقييم"
            : "Please write your review")
      );
      hasError = true;
    } else {
      setDescError("");
    }

    if (hasError) return;

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
      setRateError("");
      setTitleError("");
      setDescError("");
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
    <form onSubmit={handleSubmit} className="review-form" noValidate>
      <h4 className="review-form-title">
        {t.singelPages.write_a_review || "Write a Review"}
      </h4>

      {/* Star Rating with Error Validation */}
      <div className="box forInput review-rating-box">
        <div className="inputHolder">
          <div className="review-rating-picker">
            <Rating
              name="rating"
              value={rate}
              onChange={(_, newValue) => {
                setRate(newValue || 0);
                if (newValue) setRateError("");
              }}
              sx={{
                fontSize: "42.5px !important",
                color: "var(--main-color)",
                gap: "7px",
                "& .MuiRating-icon": {
                  fontSize: "42.5px !important",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "42.5px !important",
                  width: "42.5px !important",
                  height: "42.5px !important",
                },
                "& .MuiRating-iconEmpty": {
                  color: "var(--second-color)",
                },
                "& .MuiRating-iconFilled": {
                  color: "var(--main-color)",
                },
                "& .MuiRating-iconHover": {
                  color: "var(--main-color)",
                },
              }}
            />
          </div>
          {rateError && (
            <span className="error">
              <CircleAlert size={14} />
              {rateError}
            </span>
          )}
        </div>
      </div>

      {/* Review Title without icon */}
      <div className="box forInput">
        <label htmlFor="review-title">
          {t.singelPages.review_title || "Review Title"}
        </label>
        <div className="inputHolder">
          <div className="holder">
            <input
              type="text"
              id="review-title"
              placeholder={t.singelPages.review_title_placeholder || "Review title"}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
            />
          </div>
          {titleError && (
            <span className="error">
              <CircleAlert size={14} />
              {titleError}
            </span>
          )}
        </div>
      </div>

      {/* Review Description with checkout inputHolder structure */}
      <div className="box forInput">
        <label htmlFor="review-desc">
          {t.singelPages.your_review || "Your Review"}
        </label>
        <div className="inputHolder">
          <div className="holder textarea-holder">
            <textarea
              id="review-desc"
              placeholder={t.singelPages.review_desc_placeholder || "Write your review..."}
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                if (e.target.value.trim()) setDescError("");
              }}
              rows={4}
            />
          </div>
          {descError && (
            <span className="error">
              <CircleAlert size={14} />
              {descError}
            </span>
          )}
        </div>
      </div>

      {error && (
        <span className="error" style={{ fontSize: "13px" }}>
          <CircleAlert size={14} />
          {error}
        </span>
      )}

      <button
        type="submit"
        className="main-button back-light-animation review-submit-btn"
        disabled={submitting}
      >
        {submitting
          ? (t.dashboard?.forms?.loading || "Loading...")
          : (t.singelPages.submit_review || "Submit Review")}
      </button>
    </form>
  );
}

