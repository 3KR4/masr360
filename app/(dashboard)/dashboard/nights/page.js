"use client";
import React, { useContext, useState, useEffect, useCallback } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { nightsAr, nightsEn, governoratesEn, governoratesAr } from "@/data";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { getAll, remove } from "@/services/nights/nights.service";
import { useNotification } from "@/Contexts/NotificationContext";

export default function Nights() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [nights, setNights] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const limit = 5;
  const { addNotification } = useNotification();

  const fetchNights = useCallback(async () => {
    try {
      const res = await getAll(page, limit, locale);
      const response = res.data[0];

      setNights(response?.data ?? []);

      const totalCountRaw = response?.totalCount?.[0];
      const total = typeof totalCountRaw === "number"
        ? totalCountRaw
        : totalCountRaw?.count ?? 0;
      setPageCount(Math.max(1, Math.ceil(total / limit)));
    } catch (error) {
      console.error("Error fetching nights:", error);
      setNights(locale === "EN" ? nightsEn : nightsAr);
    }
  }, [locale, page, limit]);

  useEffect(() => {
    let mounted = true;

    const loadNights = async () => {
      if (!mounted) return;
      await fetchNights();
    };

    loadNights();

    return () => {
      mounted = false;
    };
  }, [fetchNights]);

  const deleteNight = async (id) => {
    try {
      await remove(id);
      await fetchNights();
      addNotification({
        type: "success",
        message: "Night has been deleted successfully",
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
        <div className="table-container governorates nights">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.placeDetails}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.categoriesAndSubcategories}
                </div>
                <div className="header-item">{t.dashboard.tables.reviews}</div>
                <div className="header-item">
                  {t.dashboard.tables.viewsCount}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.governorate}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                {t.dashboard.tables.cartItems}
              </div>
            )}
          </div>

          <div className="table-items">
            {nights.slice(0, 7).map((item) => {
              const itemId = item?._id || item?.id;
              const imageUrl = item?.imgs?.[0]?.url || item?.img?.url || "";
  
              const localeKey = String(locale || "EN").toUpperCase();
              const itemName =
                item?.translations?.[localeKey]?.name ||
                item?.name ||
                item?.translations?.EN?.name ||
                item?.translations?.AR?.name ||
                "";
              const itemDescription =
                item?.translations?.[localeKey]?.desc ||
                item?.desc ||
                item?.description ||
                item?.translations?.EN?.desc ||
                item?.translations?.AR?.desc ||
                "";
              const placeGov =
                locale == "EN"
                  ? governoratesEn?.find((x) => x.id == item?.governorate?.id || x.id == item?.governorate?._id)
                  : governoratesAr?.find((x) => x.id == item?.governorate?.id || x.id == item?.governorate?._id);
              return (
                <div key={itemId} className="table-item">
                  <div className="holder">
                    <Link href={`/nights/${itemId}`} className="item-image">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={itemName || "Night image"}
                          fill
                          className="product-image"
                        />
                      ) : (
                        <div className="item-image-empty" />
                      )}
                    </Link>

                    <div className="item-details">
                      <Link href={`/nights/${itemId}`} className="item-name">
                        {itemName}
                      </Link>
                      <p className="description">{itemDescription}</p>
                    </div>
                  </div>
                  <div className="categories">
                    <h4>{t.dashboard.tables.ancientEgypt}</h4>/
                    <h4>{t.dashboard.tables.deserts}</h4>
                  </div>
                  <div className="item-rating">
                    <h4>
                      {item?.reviewsCount} {t.dashboard.tables.review}
                    </h4>
                    <div className="row-holder">
                      <Rating
                        name="read-only"
                        value={item?.rate}
                        precision={0.1}
                        readOnly
                        sx={{ color: "#ea8c43", fontSize: "19px" }}
                      />
                      <h4>({item?.rate})</h4>
                    </div>
                  </div>
                  <div className="item-overview">
                    <h4>
                      15000 <FaEye />
                    </h4>
                  </div>

                  <Link href={`/discover/${placeGov?.id}`} className="link">
                    <FaLocationDot />
                    {placeGov?.name}
                  </Link>

                  <div className="actions">
                    <Link href={`/nights/${itemId}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/nights/form?edit=${itemId}`}>
                      <MdEdit
                        className="edit"
                        title={t.dashboard.tables.edit}
                      />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => deleteNight(itemId)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          pageCount={pageCount}
          screenSize={screenSize}
          isDashBoard={true}
          onPageChange={(selectedPage) => {
            setPage(selectedPage.selected + 1);
          }}
          nextText={t.dashboard.tables.next}
          prevText={t.dashboard.tables.prev}
          firstText={t.dashboard.tables.first}
          lastText={t.dashboard.tables.last}
        />
      </div>
    </div>
  );
}
