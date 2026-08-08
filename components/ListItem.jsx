"use client";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Rating from "@mui/material/Rating";
import DisplayPrice from "@/components/DisplayPrice";
import { FaLocationDot, FaEye } from "react-icons/fa6";
import { IoCartOutline, IoHeartOutline, IoCartSharp, IoHeart } from "react-icons/io5";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import useCart from "@/hooks/client/useCart";
import useFavoriet from "@/hooks/client/useFavoriet";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ListItem({ item, type }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { toggleItem, isFavorited } = useFavoriet();
  const [activeImg, setActiveImg] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [itemCartItem, setItemCartItem] = useState(item?.cartItem || null);

  useEffect(() => {
    setItemCartItem(item?.cartItem || null);
  }, [item?.cartItem]);

  const isProduct = type === "product";
  const isPlace = type === "place";
  const isNight = type === "night";

  const getItemLink = () => {
    if (isProduct) return `/marketplace/${item?.id}`;
    if (isPlace) return `/places/${item?.id}`;
    if (isNight) return `/nights/${item?.id}`;
    return "#";
  };

  const inCart = isProduct && (!!itemCartItem || isInCart(item?.id));
  const favorited = isProduct && isFavorited("Product", item?.id);

  const handleAddToCart = async () => {
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

  const handleToggleFav = async () => {
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

  const images = item?.images || [];

  return (
    <div className={`list-item ${type}`}>
      <div className="list-item-image">
        {images.length > 1 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={0}
            slidesPerView={1}
            className="list-item-swiper"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-image-wrapper">
                  <Image src={img} alt={item?.name} fill className="swiper-image" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="single-image-wrapper">
            <Image src={images[0]} alt={item?.name} fill />
          </div>
        )}
      </div>

      <div className="list-item-content">
        <div className="list-item-top">
          <Link href={getItemLink()} className="list-item-name">
            {item?.name}
          </Link>

          {(isPlace || isNight) && item?.governorate && (
            <Link
              href={`/${isPlace ? "places" : "nights"}/${
                item?.governorateId ||
                item?.governorate?._id ||
                item?.governorate?.id ||
                (typeof item?.governorate === "string" ? item?.governorate : "")
              }`}
              className="list-item-location"
            >
              <FaLocationDot />
              <span>
                {item?.governorate?.translations?.[locale]?.name ||
                  item?.governorate?.name ||
                  item?.governorateName ||
                  ""}
              </span>
            </Link>
          )}
        </div>

        {(isProduct || isNight) && item?.rate > 0 && (
          <div className="list-item-rating">
            <Rating
              name="read-only"
              value={item?.rate}
              precision={0.1}
              readOnly
              sx={{ color: "#ea8c43", fontSize: "16px" }}
            />
            <span className="count">
              ({item?.reviewsCount || 0}) {t.mainCard.reviews}
            </span>
          </div>
        )}

        <p className="list-item-description">{item?.description}</p>

        {isProduct && (
          <div className="list-item-product-info">
            <DisplayPrice price={item?.price} sale={item?.sale} stock={item?.stock} />

            {item?.specifications?.length > 0 && (
              <div className="list-item-specs">
                {item.specifications.map((spec, index) => (
                  <span key={index} className="spec-tag">
                    {spec.key}: {spec.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {isPlace && item?.tickets && (
          <div className="list-item-place-info">
            {item.tickets.type === "free" ? (
              <span className="free-badge">{t.singelPages.freeToVisit}</span>
            ) : item.tickets.prices ? (
              <div className="ticket-prices">
                {item.tickets.prices.staticPrice > 0 && (
                  <span className="ticket-price">
                    {item.tickets.prices.staticPrice} EGP
                  </span>
                )}
                {item.tickets.prices.pricePerAge && (
                  <div className="price-details">
                    {Object.entries(item.tickets.prices.pricePerAge).map(([age, price]) => (
                      <span key={age} className="price-tag">
                        {age}: {price} EGP
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {isNight && (
          <div className="list-item-night-info">
            {item?.eventStartAt && (
              <span className="event-time">
                {t.mainCard.startAt}: {new Date(item.eventStartAt).toLocaleDateString(locale === "AR" ? "ar-EG" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {item?.eventLasts && (
              <span className="event-duration">
                {t.mainCard.lasts}: {item.eventLasts}
              </span>
            )}
          </div>
        )}

        <div className="list-item-actions">
          {isProduct ? (
            <>
              <Link href={getItemLink()} className="main-button forCart list-view-btn">
                <FaEye />
                {t.mainCard.seeProduct}
              </Link>
              <button
                className={`main-button forCart list-view-btn ${inCart ? "active" : ""}`}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <span className="loader" />
                ) : (
                  <>
                    {inCart ? <IoCartSharp /> : <IoCartOutline />}
                    {inCart ? (t.actions.in_cart || "In Cart") : t.actions.add_to_cart}
                  </>
                )}
              </button>
              <button
                className={`main-button forCart list-view-btn ${favorited ? "active" : ""}`}
                onClick={handleToggleFav}
                disabled={togglingFav}
              >
                {togglingFav ? (
                  <span className="loader" />
                ) : (
                  <>
                    {favorited ? <IoHeart /> : <IoHeartOutline />}
                    {favorited ? (t.actions.in_favorites_list || "In Favorites List") : t.actions.add_to_favorites}
                  </>
                )}
              </button>
            </>
          ) : (
            <Link href={getItemLink()} className="main-button forCart">
              {t.mainCard.seeDetails}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
