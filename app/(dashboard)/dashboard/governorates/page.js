"use client";
import React, { useContext, useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
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
import { getAll, remove } from "@/services/govenorates/govenorates.service";
import { dashboard } from "@/Contexts/dashboard";
import { useNotification } from "@/Contexts/NotificationContext";

export default function Governorates() {
  const { locale, screenSize } = useContext(mainContext);
  const { searchText } = useContext(dashboard);
  const t = useTranslate();
  const [governorates, setgovernorates] = useState([]);
  const [loading, setLoading] = useState(false);
  const limit = 10000;
  const { addNotification } = useNotification();
  const fetchGovernorates = async () => {
    try {
      setLoading(true);

      const { governorates: govData } = await getAll(searchText, 1, limit, locale);
      setgovernorates(govData || []);
    } catch (error) {
      console.error("Error fetching governorates:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGovernorates();
  }, [locale, searchText]);

  const deleteGovernorates = async (id) => {
    try {
      await remove(id);

      await fetchGovernorates(); // 🔥 ده الحل الصح

      addNotification({
        type: "success",
        message: "Governorate has been deleted successfully",
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

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
              console.log("xx", item);

              return (
                <div key={item?._id} className="table-item">
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
                        {item?.translations?.[locale]?.name || item?.name}
                      </Link>
                      <p className="description">
                        {item?.translations?.[locale]?.desc || item?.desc}
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
                      {item?.placesCount || 0} <FaPlaceOfWorship />
                    </h4>
                  </div>

                  <div className="actions">
                    <Link href={`/discover/${item?._id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link
                      href={`/dashboard/governorates/form?edit=${item?._id}`}
                    >
                      <MdEdit className="edit" />
                    </Link>

                    <hr />
                    <FaTrashAlt
                      className="delete"
                      onClick={() => deleteGovernorates(item?._id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
