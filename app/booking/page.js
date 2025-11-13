"use client";
import Image from "next/image";
import React from "react";
import "@/styles/pages/tables.css";

import "@/styles/forms.css";
import { bookings } from "@/data";
import { FaBoxOpen } from "react-icons/fa";
import Link from "next/link";

function Bookings() {
  return (
    <div className="booking" style={{ minHeight: "53vh" }}>
      {bookings.length > 0 ? (
        <>
          <div className="title-holder pages container">
            <h1 className="main-title">
              <hr />
              your bookings list
              <hr />
            </h1>
            <p className="sub-title">
              View all your booked trips and site visits, check payment details,
              and see when your visit is scheduled.
            </p>
          </div>

          <div className="container">
            <div className="table-container order-table">
              <div className="table-header">
                <div className="header-item details">place details</div>
                <div className="header-item">ticket price</div>
                <div className="header-item">people count</div>
                <div className="header-item">total paid</div>
                <div className="header-item">booking date</div>
                <div className="header-item">visit date</div>
              </div>

              <div className="table-items">
                {bookings.map((item) => (
                  <div key={item.id} className="table-item">
                    <div className="holder">
                      {/* صورة المكان */}
                      <Link href={`/places/${item?.id}`} className="item-image">
                        <Image
                          src={item.place.image}
                          alt={item.place.name}
                          width={110}
                          height={90}
                          className="product-image"
                        />
                      </Link>

                      {/* اسم المحافظة */}
                      <div className="item-details">
                        <Link
                          href={`/places/${item?.id}`}
                          className="item-name"
                        >
                          {item.place.name}
                        </Link>
                        <Link href={`/discover/1`} className="link">
                          in {item.place.govermorate}
                        </Link>
                      </div>
                    </div>

                    {/* سعر التذكرة */}
                    <p className="price">${item.ticketPrice.toFixed(2)}</p>

                    {/* عدد الأفراد */}
                    <p className="people-count">
                      {item.peopleCount}{" "}
                      {item.peopleCount > 1 ? "people" : "person"}
                    </p>

                    {/* الإجمالي */}
                    <p className="price">${item.totalPaid.toFixed(2)}</p>

                    {/* تاريخ الحجز */}
                    <p className="date">
                      {new Date(item.bookingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {/* تاريخ الزيارة */}
                    <p className="date">
                      {new Date(item.visitDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="error-page container">
          <FaBoxOpen />
          <h4>Your bookings list is empty</h4>
          <p>
            You haven’t booked any trips or site visits yet. Start exploring
            Egypt’s top destinations and book your next adventure now!
          </p>
          <div className="btns">
            <Link href={`/places`} className="main-button">
              Explore places
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
