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
import { FaRegHeart } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { governoratesAr, governoratesEn } from "@/data";

import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice";
import CountDown from "@/components/CountDown";
import useTranslate from "@/Contexts/useTranslation";
import useCart from "@/hooks/client/useCart";
import useFavoriet from "@/hooks/client/useFavoriet";
import { useRouter } from "next/navigation";

export default function CardItem({ item, type, previewGame = false }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { toggleItem, isFavorited } = useFavoriet();
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [itemCartItem, setItemCartItem] = useState(item?.cartItem || null);

  useEffect(() => {
    setItemCartItem(item?.cartItem || null);
  }, [item?.cartItem]);

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isGov = type === "gov";
  const isGame = type === "game";
  const isNight = type === "night";
  const isEvent = type === "event";
  const inCart = isProduct && (!!itemCartItem || isInCart(item?.id));
  const favorited = isProduct && isFavorited("Product", item?.id);
  const isOutOfStock = isProduct && Number(item?.stock || 0) <= 0;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProduct || isOutOfStock || addingToCart) return;
    if (inCart) {
      router.push("/cart");
      return;
    }
    setAddingToCart(true);
    try {
      const added = await addItem(item?.id, 1);
      if (added) setItemCartItem({ cartQuantity: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProduct || togglingFav) return;
    if (favorited) {
      router.push("/favorites");
      return;
    }
    setTogglingFav(true);
    try {
      await toggleItem("Product", item?.id);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingFav(false);
    }
  };

  const getButtonText = () => {
    if (isProduct) return t.mainCard.seeProduct;
    if (isGame) return t.mainCard.startJourney;
    return t.mainCard.seeDetails;
  };

  const currentGovernorate =
    locale === "EN"
      ? governoratesEn?.find(
          (x) =>
            x.id === item?.governorate?.id ||
            x.id === item?.governorate?._id ||
            x.id === item?.governorate,
        )
      : governoratesAr?.find(
          (x) =>
            x.id === item?.governorate?.id ||
            x.id === item?.governorate?._id ||
            x.id === item?.governorate,
        );

  const govName =
    item?.governorate?.translations?.[locale]?.name ||
    item?.governorate?.name ||
    item?.governorateName ||
    currentGovernorate?.name ||
    "";

  const govId =
    currentGovernorate?.id ||
    item?.governorate?._id ||
    item?.governorate?.id ||
    (typeof item?.governorate === "string" ? item?.governorate : "");

  const currentGamePlace =
    locale === "EN"
      ? governoratesEn?.find((x) => x.id === item?.place?.id)
      : governoratesAr?.find((x) => x.id === item?.place?.id);

  const getEventDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
    if (diff <= 0) return "";
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (totalMinutes < 60) return `${totalMinutes} ${locale === "AR" ? "دقيقة" : "min"}`;
    if (totalHours < 24) return `${totalHours} ${locale === "AR" ? "ساعة" : "hours"}`;
    if (totalDays < 30) return `${totalDays} ${locale === "AR" ? "يوم" : "days"}`;
    const months = Math.floor(totalDays / 30);
    return `${months} ${locale === "AR" ? "شهر" : "months"}`;
  };

  const eventStartAt = item?.startDate || item?.eventStartAt;
  const eventDuration = item?.eventLasts || getEventDuration(item?.startDate, item?.endDate);

  return (
    <div key={item?.id} className={`card ${type}`}>
      {(isProduct || isPlace) && (
        <div className="actions-icon">
          {isProduct ? (
            <>
              <button
                type="button"
                className={`wish-icon ${favorited ? "active" : ""}`}
                onClick={handleToggleFavorite}
                disabled={togglingFav}
                aria-label={favorited ? "Open favorites" : "Add to favorites"}
              >
                {favorited ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button
                type="button"
                className={`cart-icon ${inCart ? "active" : ""}`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                aria-label={inCart ? "Open cart" : "Add to cart"}
              >
                <FaCartShopping />
              </button>
            </>
          ) : (
            <FaHeart className="wish-icon" />
          )}
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
                    ? `/events/${item?.id}`
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
        {!isGov && !previewGame && (
          <button className="main-button">{getButtonText()}</button>
        )}
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
                    ? `/games/preview/${item?.id}`
                    : isNight
                      ? `/nights/${item?.id}`
                      : isEvent
                        ? `/events/${item?.id}`
                        : `/discover/${item?.id}`
            }
            className="name-link ellipsis"
          >
            {isGov
              ? item?.translations?.[locale]?.name || item?.name
              : item?.name}
          </Link>

          {(isPlace || isNight || isEvent) && (
            <Link
              href={`/${isPlace ? "places" : isEvent ? "events" : "nights"}/${govId}`}
              className="location"
            >
              <FaLocationDot />
              {govName}
            </Link>
          )}

          {isGov && (
            <Link className="explore" href={`/discover/${item?.id}`}>
              {screenSize !== "small" ? t.mainCard.explore : ""}{" "}
              {item?.count || 0} {t.mainCard.places}{" "}
              {locale === "EN" ? (
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
            className={`ellipsis description ${previewGame ? "no-clamp" : ""}`}
          >
            {isGov
              ? item?.translations?.[locale]?.desc || item?.description
              : item?.description}
          </p>
        )}
        {previewGame && (
          <Link href={`/games/${item?.id}`} className={`main-button`}>
            {t.games.purchase_and_play_now}
          </Link>
        )}

        {/* EVENT */}
        {isEvent && (
          <div className="time-holder">
            <CountDown
              eventStartAt={eventStartAt}
              startLabel={t.mainCard.startAt}
              lastsLabel={t.mainCard.lasts}
            />
            <hr />
            <div>
              <span>{t.mainCard.eventTime}:</span>{" "}
              <span>{eventDuration}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
