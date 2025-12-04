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
import CountDown from "@/components/CountDown";

export default function CardItem({ item, type }) {
  const { screenSize } = useContext(mainContext);

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";
  const isGame = type === "game";
  const isNight = type === "night";
  const isEvent = type === "event";

  return (
    <div key={item?._id} className={`card ${type}`}>
      {/* ❤️ ACTION ICONS */}
      {(isProduct || isPlace) && (
        <div className="actions-icon">
          {!isGame && <FaHeart className="wish-icon" />}
          {isProduct && <FaCartShopping className="cart-icon" />}
        </div>
      )}

      {/* 🖼 IMAGE + BUTTON */}
      <Link
        href={
          isProduct
            ? `/marketplace/${item?._id}`
            : isPlace
            ? `/places/${item?._id}`
            : isGame
            ? `/games/${item?._id}`
            : isNight
            ? `/nights/${item?._id}`
            : isEvent
            ? `/nights/${item?._id}?event=true`
            : isGov
            ? `/discover/${item?._id}`
            : ``
        }
        className="image-holder"
      >
        <Image
          src={
            isGov || isPlace
              ? item.img
              : isGame
              ? item?.place?.image
              : item?.image
          }
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
                ? `/marketplace/${item?._id}`
                : isPlace
                ? `/places/${item?._id}`
                : isGame
                ? `/games/${item?._id}`
                : isNight
                ? `/nights/${item?._id}`
                : isEvent
                ? `/nights/${item?._id}?isEvent=true`
                : `/discover/${item?._id}`
            }
            className="name-link ellipsis"
          >
            {item?.name}
          </Link>
          {isGame && <p>/ {item?.questions?.length} questions</p>}
          {(isPlace || isNight || isEvent) && (
            <Link
              href={`/${isPlace ? "places" : "nights"}/${item?._id}${
                isEvent ? "?isEvent=true" : ""
              }`}
              className="location"
            >
              <FaLocationDot />
              {item?.governorate?.name}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover/${item?._id}`}>
              {screenSize !== "small" ? "Explore" : ""} {item?.count} places{" "}
              <FaArrowRight className="arrow" />
            </Link>
          )}
        </div>
        {isGame && (
          <Link href={`/games/${item?._id}`} className="main-button rewards">
            {item?.reward} coin reward
          </Link>
        )}
        {/* ⭐ RATING */}
        {(isProduct || isNight) && (
          <div className="reviews">
            <Rating
              name="read-only"
              value={item?.rate}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "18px" }}
            />
            <span className="count">{item?.reviewsCount} Review</span>
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
        {item?.desc && <p className="ellipsis">{item?.desc}</p>}

        {isEvent && (
          <div className="time-holder">
            <CountDown eventStartAt={item.eventStartAt} />
            <hr />
            <div>
              <span>event time:</span> <span>{item.eventLasts}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
