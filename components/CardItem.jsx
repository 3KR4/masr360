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
import DisplayPrice from "@/components/DisplayPrice";
import CountDown from "@/components/CountDown";

import useTranslate from "@/Contexts/useTranslation";

export default function CardItem({ item, type }) {
  const t = useTranslate();
  const { screenSize } = useContext(mainContext);

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";
  const isGame = type === "game";
  const isNight = type === "night";
  const isEvent = type === "event";

  // دالة للحصول على نص الزر بناءً على النوع
  const getButtonText = () => {
    if (isProduct) return t.mainCard.seeProduct;
    if (isGame) return t.mainCard.startJourney;
    return t.mainCard.seeDetails;
  };

  // دالة للحصول على نص المكافأة
  const getRewardText = () => {
    return `${item?.reward || 0} ${t.mainCard.reward}`;
  };

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
        {!isGov && <button className="main-button">{getButtonText()}</button>}
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

          {isGame && (
            <p>
              / {item?.questions?.length || 0} {t.mainCard.questions}
            </p>
          )}

          {(isPlace || isNight || isEvent) && (
            <Link
              href={`/${isPlace ? "places" : "nights"}/${item?._id}${
                isEvent ? "?isEvent=true" : ""
              }`}
              className="location"
            >
              <FaLocationDot />
              {item?.governorate}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover/${item?._id}`}>
              {screenSize !== "small" ? t.mainCard.explore : ""}{" "}
              {item?.count || 0} {t.mainCard.places}{" "}
              <FaArrowRight className="arrow" />
            </Link>
          )}
        </div>

        {isGame && (
          <Link href={`/games/${item?._id}`} className="main-button rewards">
            {getRewardText()}
          </Link>
        )}

        {/* ⭐ RATING */}
        {(isProduct || isNight) && (
          <div className="reviews">
            <Rating
              name="read-only"
              value={item?.rate || 0}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "18px" }}
            />
            <span className="count">
              {item?.reviewsCount || 0} {t.mainCard.reviews}
            </span>
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
            <CountDown
              eventStartAt={item.eventStartAt}
              startLabel={t.mainCard.startAt}
              lastsLabel={t.mainCard.lasts}
            />
            <hr />
            <div>
              <span>{t.mainCard.eventTime}:</span>{" "}
              <span>{item.eventLasts}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
