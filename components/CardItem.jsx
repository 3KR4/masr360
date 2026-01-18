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

export default function CardItem({ item, type, previewGame = false }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";
  const isGame = type === "game";
  const isNight = type === "night";
  const isEvent = type === "event";

  const getButtonText = () => {
    if (isProduct) return t.mainCard.seeProduct;
    if (isGame) return t.mainCard.startJourney;
    return t.mainCard.seeDetails;
  };

  const currentGovernorate =
    locale === "en"
      ? governoratesEn?.find((x) => x.id === item?.governorate?.id)
      : governoratesAr?.find((x) => x.id === item?.governorate?.id);

  const currentGamePlace =
    locale === "en"
      ? governoratesEn?.find((x) => x.id === item?.place?.id)
      : governoratesAr?.find((x) => x.id === item?.place?.id);

  return (
    <div key={item?.id} className={`card ${type}`}>
      {(isProduct || isPlace) && (
        <div className="actions-icon">
          <FaHeart className="wish-icon" />
          {isProduct && <FaCartShopping className="cart-icon" />}
        </div>
      )}

      <Link
        href={
          isProduct
            ? `/marketplace/${item?.id}`
            : isPlace
              ? `/places/${item?.id}`
              : isGame
                ? `/games/preview/${item?.id}`
                : isNight
                  ? `/nights/${item?.id}`
                  : isEvent
                    ? `/nights/${item?.id}?event=true`
                    : isGov
                      ? `/discover/${item?.id}`
                      : ""
        }
        className="image-holder"
      >
        <Image
          src={isGov || isGame ? item?.image : item?.images?.[0]}
          alt={item?.name}
          fill
        />
        {(!isGov && !previewGame) && <button className="main-button">{getButtonText()}</button>}
      </Link>

      {/* TEXT CONTENT */}
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
              {locale === "en" ? (
                <FaArrowRight className="arrow" />
              ) : (
                <FaArrowLeft className="arrow" />
              )}
            </Link>
          )}
          {isGame && (
            <span className="steps">
              {item?.totalSteps} {t.games.step}
            </span>
          )}
        </div>

        {/* RATING */}
        {(isProduct || isNight || isGame) && !previewGame && (
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
        {isGame && (
          <span className="difficulty color">{t.games[item?.difficulty]}</span>
        )}
        {/* PRICE */}
        {isProduct && (
          <DisplayPrice
            price={item?.price}
            sale={item?.sale}
            stock={item?.stock}
          />
        )}

        {/* GAME DETAILS */}
        {isGame && (
          <div className="holder">
            <div className="hold">
              <span className="color">{t.dashboard.forms.price}:</span>
              <DisplayPrice price={item?.price} sale={item?.sale} />
            </div>
            <div className="hold">
              <span className="color">{t.games.timeToFinish}:</span>
              <span className="estimatedTime color">{item?.estimatedTime}</span>
            </div>
            <div className="hold">
              <span className="color">{t.games.totalCoins}:</span>
              <span className="estimatedTime color">
                {item?.totalCoins} {t.games.credits}
              </span>
            </div>
          </div>
        )}

        {item?.description && (
          <p
            className={`"ellipsis description ${previewGame ? "no-clamp" : ""}`}
          >
            {item?.description}
          </p>
        )}
        {previewGame && (
          <putton className={`main-button`}>purchase and play now</putton>
        )}

        {/* EVENT */}
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
