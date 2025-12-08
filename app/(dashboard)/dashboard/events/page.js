"use client";
import React, { useContext, useState, useRef } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";

import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { mainContext } from "@/Contexts/mainContext";
import { nights } from "@/data";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { FaPlaceOfWorship } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import CountDown from "@/components/CountDown";

export default function Events() {
  const { screenSize } = useContext(mainContext);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container governorates nights">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">places details</div>
                <div className="header-item">category</div>
                <div className="header-item">event lasts</div>
                <div className="header-item">starting time</div>
                <div className="header-item">views count</div>
                <div className="header-item">governorate</div>
                <div className="header-item">Actions</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                cart items
              </div>
            )}
          </div>

          <div className="table-items">
            {nights.slice(0, 7).map((item) => {
              return (
                <div key={item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/`} className="item-name">
                        {item?.name}
                      </Link>
                      <p className="description">{item?.description}</p>
                    </div>
                  </div>
                  <div className="categories">
                    <h4>Ancient Egypt</h4>/<h4>deserts</h4>
                  </div>
                  <div className="event-lasts">
                    <h4>{item?.eventStartAt}</h4>
                  </div>
                  <div className="item-startAt">
                    <h4>
                      <CountDown eventStartAt={item?.eventStartAt} />
                    </h4>
                  </div>

                  <div className="item-overview">
                    <h4>
                      15000 <FaEye />
                    </h4>
                  </div>

                  <Link
                    href={`/discover/${item?.govermorate}`}
                    className="link"
                  >
                    <FaLocationDot />
                    {item?.govermorate}
                  </Link>

                  <div className="actions">
                    <Link href={`/places/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/places/form?edit=${item?.id}`}>
                      <MdEdit className="edit" />
                    </Link>

                    <hr />
                    <FaTrashAlt className="delete" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          pageCount={50}
          screenSize={screenSize}
          onPageChange={() => {}}
          isDashBoard={true}
        />
      </div>
    </div>
  );
}
