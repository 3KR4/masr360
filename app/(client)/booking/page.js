"use client";
import Image from "next/image";
import React from "react";
import "@/styles/pages/tables.css";
import { useContext } from "react";
import "@/styles/forms.css";
import {
  bookings,
  governoratesAr,
  governoratesEn,
  placesEn,
  placesAr,
} from "@/data";
import { FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";

function Bookings() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const dateLocale = locale === "ar" ? "ar-EG" : "en-US";
  return (
    <div className="booking">
      {bookings.length > 0 ? (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              {t.booking.yourBookingsList}
              <hr />
            </h1>
            <p className="sub-title">{t.booking.subtitle}</p>
          </div>

          <div className="container">
            <div className="table-container order-table">
              <div className="table-header">
                {screenSize !== "small" ? (
                  <>
                    <div className="header-item details">
                      {t.booking.placeDetails}
                    </div>
                    <div className="header-item">{t.booking.ticketPrice}</div>
                    <div className="header-item">{t.booking.peopleCount}</div>
                    <div className="header-item">{t.booking.totalPaid}</div>
                    <div className="header-item">{t.booking.bookingDate}</div>
                    <div className="header-item">{t.booking.visitDate}</div>
                  </>
                ) : (
                  <div className="header-item" style={{ fontSize: "17px" }}>
                    {t.booking.bookingList}
                  </div>
                )}
              </div>

              <div className="table-items">
                {bookings.map((item) => {
                  const place =
                    locale == "en"
                      ? placesEn?.find((x) => x.id == item.place.id)
                      : placesAr?.find((x) => x.id == item.place.id);
                  console.log(place);

                  const placeGov =
                    locale == "en"
                      ? governoratesEn?.find(
                          (x) => x.id == place?.governorate?.id
                        )
                      : governoratesAr?.find(
                          (x) => x.id == place?.governorate?.id
                        );
                  console.log(placeGov);

                  return (
                    <div key={item.id} className="table-item">
                      <div className="holder">
                        {/* صورة المكان */}
                        <Link
                          href={`/places/${place?.id}`}
                          className="item-image"
                        >
                          <Image
                            src={place.images[0]}
                            alt={place.name}
                            fill
                            className="product-image"
                          />
                        </Link>

                        {/* اسم المحافظة */}
                        <div className="item-details">
                          <Link
                            href={`/places/${item?.id}`}
                            className="item-name"
                          >
                            {place.name}
                          </Link>
                          <Link
                            href={`/discover/${placeGov?.id}`}
                            className="link"
                          >
                            {t.booking.in} {placeGov?.name}
                          </Link>
                        </div>
                      </div>

                      {/* سعر التذكرة */}
                      <p className="price">
                        {screenSize == "small" ? (
                          <span>{t.booking.ticketPrice}:</span>
                        ) : null}
                        ${item.ticketPrice.toFixed(2)}
                      </p>

                      {/* عدد الأفراد */}
                      <p className="people-count">
                        {screenSize == "small" ? (
                          <span>{t.booking.peopleCount}:</span>
                        ) : null}
                        {item.peopleCount}{" "}
                        {screenSize === "small"
                          ? null
                          : item.peopleCount > 1
                          ? t.booking.people
                          : t.booking.person}
                      </p>

                      {/* الإجمالي */}
                      <p className="price">
                        {screenSize == "small" ? (
                          <span>{t.booking.totalPaid}:</span>
                        ) : null}
                        ${item.totalPaid.toFixed(2)}
                      </p>

                      <p className="date">
                        {screenSize === "small" && (
                          <span>{t.booking.bookingDate}:</span>
                        )}
                        {new Date(item.bookingDate).toLocaleDateString(
                          dateLocale,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>

                      {/* تاريخ الزيارة */}
                      <p className="date">
                        {screenSize === "small" && (
                          <span>{t.booking.visitDate}:</span>
                        )}
                        {new Date(item.visitDate).toLocaleDateString(
                          dateLocale,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="error-page container">
          <FaBoxOpen />
          <h4>{t.booking.emptyBookings}</h4>
          <p>{t.booking.emptyMessage}</p>
          <div className="btns">
            <Link href={`/places`} className="main-button">
              {t.booking.explorePlaces}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
