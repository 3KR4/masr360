import React from "react";
import { useContext } from "react";
import Rating from "@mui/material/Rating";
import "@/styles/components/reviews.css";
import { FaStar } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

export default function ReviewSection({ reviews }) {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const dateLocale = locale === "ar" ? "ar-EG" : "en-US";

  return (
    <div className="review-section">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.singelPages.Ratings}
          <hr />
        </h1>

        <p className="sub-title">{t.singelPages.rating_sub_title}</p>
      </div>
      <div className="holder">
        <div className="overview">
          <h3>{t.sideNav.overview}</h3>
          <div className="hold">
            <Rating
              name="read-only"
              value={reviews?.overview?.finalRate}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "20px" }}
            />
            <span className="count">
              {reviews?.overview?.finalRate}{" "}
              {locale == "en"
                ? reviews.finalRate == 1
                  ? t.singelPages.star
                  : t.singelPages.stars
                : t.singelPages.star}
            </span>
          </div>
          <p>
            {t.singelPages.based_on} {reviews?.overview?.totalReviews}{" "}
            {reviews?.overview?.totalReviews == 1
              ? t.dashboard.tables.review
              : t.dashboard.tables.reviews}
          </p>
          <ul className="holder">
            {Object.entries(reviews?.overview.rates)
              .sort((a, b) => b[0] - a[0]) // ترتيب من 5 إلى 1
              .map(([rate, count]) => {
                const total = reviews?.overview.totalReviews;
                const percentage = ((count / total) * 100).toFixed(0);

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
          {reviews?.reviews?.map((x, index) => (
            <div className="review" key={index}>
              {screenSize === "large" && (
                <div className="image left">
                  {x.fullName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hold">
                <div className="top">
                  {screenSize !== "large" && (
                    <div className="image left">
                      {x.fullName.charAt(0).toUpperCase()}
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
                </div>

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
                    {locale == "en"
                      ? reviews.finalRate == 1
                        ? t.singelPages.star
                        : t.singelPages.stars
                      : t.singelPages.star}
                  </span>
                </div>
                <h4>{x.title}</h4>
                <p>{x.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
