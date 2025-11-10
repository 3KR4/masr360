"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaCartShopping,
  FaLocationDot,
  FaArrowRight,
} from "react-icons/fa6";
import React, { useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";

import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice"; // optional, only for product

export default function CardItem({ item, type }) {
  const { screenSize } = useContext(mainContext);

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";
  const isGame = type === "game";

  return (
    <div key={item?.id} className={`card ${type}`}>
      {/* ❤️ ACTION ICONS */}
      {!isGov && !isGame && (
        <div className="actions-icon">
          {!isGame && <FaHeart className="wish-icon" />}

          {isProduct && <FaCartShopping className="cart-icon" />}
        </div>
      )}

      {/* 🖼 IMAGE + BUTTON */}
      <Link
        href={
          isProduct
            ? `/marketplace/${item?.id}`
            : isPlace
            ? `/place/${item?.id}?type=place`
            : isGame
            ? `/games/${item?.id}`
            : `/discover?type=government&id=${item?.id}`
        }
        className="image-holder"
      >
        <Image
          src={!isGame ? item?.image : item?.place?.image}
          alt={item?.name}
          fill
        />
        {!isGov && (
          <button className="main-button">
            {isProduct
              ? "See Product"
              : isGame
              ? "Start the journey"
              : "See Details"}
          </button>
        )}
      </Link>

      {/* 📝 TEXT SECTION */}
      <div className="text-holder">
        <div className="top">
          <Link
            href={
              isProduct
                ? `/marketplace/${item?.id}`
                : isPlace
                ? `/place/${item?.id}?type=place`
                : isGame
                ? `/games/${item?.id}`
                : `/discover?type=government&id=${item?.id}`
            }
            className="name-link"
          >
            {item?.name}
          </Link>
          {isGame && <p>/ {item?.questions?.length} questions</p>}
          {isPlace && (
            <Link href={`/places/${item?.id}`} className="location">
              <FaLocationDot />
              {item?.govermorate}
            </Link>
          )}

          {isGov && (
            <Link
              className="explore"
              href={`/discover?type=government&id=${item?.id}`}
            >
              {screenSize !== "small" ? "Explore" : ""} {item?.count} place{" "}
              <FaArrowRight className="arrow" />
            </Link>
          )}
        </div>
        {isGame && (
          <Link href={`/games/${item?.id}`} className="main-button rewards">
            {item?.reward} coin reward
          </Link>
        )}
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
        {item?.description && <p>{item?.description}</p>}
      </div>
    </div>
  );
}
