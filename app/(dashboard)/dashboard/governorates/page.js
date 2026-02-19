"use client";
import React, { useContext, useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { governoratesEn, governoratesAr } from "@/data";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FaPlaceOfWorship } from "react-icons/fa";
import useTranslate from "@/Contexts/useTranslation";
import { getAll } from "@/services/govenorates/govenorates.service";

export default function Governorates() {
  const { locale, screenSize } = useContext(mainContext);

  const t = useTranslate();
  const [governorates, setgovernorates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchgovernorates = async () => {
      try {
        setLoading(true);

        const res = await getAll("",locale); // 👈 GET request

        console.log("Response:", res);

        setgovernorates(res.data || res); // حسب شكل الريسبونس عندك
      } catch (error) {
        console.error("Error fetching governorates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchgovernorates();
  }, [locale]);
  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container governorates">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.governorate_details}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.viewsCount}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.places_count}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                cart items
              </div>
            )}
          </div>

          <div className="table-items">
            {governorates?.map((item) => {
              return (
                <div key={item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={item?.img?.url}
                        alt={item?.name}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/`} className="item-name">
                        {item?.translations?.[locale]?.name}
                      </Link>
                      <p className="description">
                        {item?.translations?.[locale]?.desc}
                      </p>
                    </div>
                  </div>

                  <div className="item-overview">
                    <h4>
                      15000 <FaEye />
                    </h4>
                  </div>
                  <div className="item-overview">
                    <h4 className="green">
                      83 <FaPlaceOfWorship />
                    </h4>
                  </div>

                  <div className="actions">
                    <Link href={`/discover/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link
                      href={`/dashboard/governorates/form?edit=${item?.id}`}
                    >
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
