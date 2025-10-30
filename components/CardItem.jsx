"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaCartShopping,
  FaLocationDot,
  FaArrowRight,
} from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice"; // optional, only for product

export default function CardItem({ item, type }) {
  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";

  return (
    <div key={item?.id} className={`card ${isProduct ? "product" : ""}`}>
      {/* ❤️ ACTION ICONS */}
      {!isGov && (
        <div className="actions-icon">
          <FaHeart className="wish-icon" />
          {isProduct && <FaCartShopping className="cart-icon" />}
        </div>
      )}

      {/* 🖼 IMAGE + BUTTON */}
      <Link
        href={
          isProduct
            ? `/market/${item?.id}`
            : isPlace
            ? `/place/${item?.id}?type=place`
            : `/discover?type=government&id=${item?.id}`
        }
        className="image-holder"
      >
        <Image
          src={item?.image}
          alt={item?.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {!isGov && (
          <button className="main-button">
            {isProduct ? "See Product" : "See Details"}
          </button>
        )}
      </Link>

      {/* 📝 TEXT SECTION */}
      <div className="text-holder">
        <div className="top">
          <h3>{item?.name}</h3>

          {isPlace && (
            <Link href={`/places/${item?.id}?type=city`} className="location">
              <FaLocationDot />
              {item?.govermorate}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover?type=government&id=${item?.id}`}>
              Explore {item?.count} place <FaArrowRight className="arrow" />
            </Link>
          )}
        </div>

        {/* ⭐ RATING */}
        {(isProduct || isPlace) && (
          <div className="reviews">
            <Rating
              name="read-only"
              value={item?.rate}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "18px" }}
            />
            {isProduct && (
              <span className="count">{item?.reviewsCount} Review</span>
            )}
          </div>
        )}

        {/* 💰 PRICE for product only */}
        {isProduct && (
          <DisplayPrice
            price={item?.price}
            sale={item?.sale}
            stock={item?.stock}
          />
        )}

        {/* 📜 DESCRIPTION */}
        <p>{item?.description}</p>
      </div>
    </div>
  );
}
