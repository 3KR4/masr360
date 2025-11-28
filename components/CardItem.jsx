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
    <div key={item?.id} className={`card ${type}`}>
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
            ? `/marketplace/${item?.id}`
            : isPlace
            ? `/places/${item?.id}`
            : isGame
            ? `/games/${item?.id}`
            : isNight
            ? `/nights/${item?.id}`
            : isEvent
            ? `/nights/${item?.id}?event=true`
            : `/discover/${item?.id}`
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
                ? `/places/${item?.id}`
                : isGame
                ? `/games/${item?.id}`
                : isNight
                ? `/nights/${item?.id}`
                : isEvent
                ? `/nights/${item?.id}?isEvent=true`
                : `/discover/${item?.id}`
            }
            className="name-link ellipsis"
          >
            {item?.name}
          </Link>
          {isGame && <p>/ {item?.questions?.length} questions</p>}
          {(isPlace || isNight || isEvent) && (
            <Link
              href={`/${isPlace ? "places" : "nights"}/${item?.id}${
                isEvent ? "?isEvent=true" : ""
              }`}
              className="location"
            >
              <FaLocationDot />
              {item?.govermorate}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover/${item?.id}`}>
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
        {item?.description && <p className="ellipsis">{item?.description}</p>}

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
