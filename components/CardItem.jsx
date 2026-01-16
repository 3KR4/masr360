"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaCartShopping,
  FaLocationDot,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa6";
import React, { useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { governoratesAr, governoratesEn } from "@/data";

import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice";
import CountDown from "@/components/CountDown";

import useTranslate from "@/Contexts/useTranslation";

export default function CardItem({ item, type }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

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
  const currentGovernorate =
    locale == "en"
      ? governoratesEn?.find((x) => x.id == item?.governorate?.id)
      : governoratesAr?.find((x) => x.id == item?.governorate?.id);

  console.log(currentGovernorate);

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
            : isGov
            ? `/discover/${item?.id}`
            : ``
        }
        className="image-holder"
      >
        <Image
          src={
            isPlace || isNight || isEvent || isProduct
              ? item.images[0]
              : isGov
              ? item.image
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

          {isGame && (
            <p>
              / {item?.questions?.length || 0} {t.mainCard.questions}
            </p>
          )}

          {(isPlace || isNight || isEvent) && (
            <Link
              href={`/${isPlace ? "places" : "nights"}/${
                currentGovernorate?.id
              }${isEvent ? "?isEvent=true" : ""}`}
              className="location"
            >
              <FaLocationDot />
              {currentGovernorate?.name}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover/${item?.id}`}>
              {screenSize !== "small" ? t.mainCard.explore : ""}{" "}
              {item?.count || 0} {t.mainCard.places}{" "}
              {locale == "en" ? (
                <FaArrowRight className="arrow" />
              ) : (
                <FaArrowLeft className="arrow" />
              )}
            </Link>
          )}
        </div>

        {isGame && (
          <Link href={`/games/${item?.id}`} className="main-button rewards">
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

        {item?.description && <p className="ellipsis">{item?.description}</p>}

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
