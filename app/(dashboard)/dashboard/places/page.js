"use client";
import React, { useContext, useState, useEffect } from "react";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { placesAr, placesEn, governoratesEn, governoratesAr } from "@/data";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";

export default function Places() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchplaces = async () => {
      // try {
      //   const { data } = await getService.getPlaces(6);
      //   setPlaces(
      //     data || locale == "en" ? placesEn : placesAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setPlaces(locale == "en" ? placesEn : placesAr);
      // }
      setPlaces(locale == "en" ? placesEn : placesAr);
    };
    fetchplaces();
  }, [locale]);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container governorates places">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.placeDetails}
                </div>
                <div className="header-item">
                  {t.dashboard.tables.categoriesAndSubcategories}
                </div>
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
            {places.slice(0, 7).map((item) => {
              const placeGov =
                locale == "en"
                  ? governoratesEn?.find((x) => x.id == item?.governorate?.id)
                  : governoratesAr?.find((x) => x.id == item?.governorate?.id);
              return (
                <div key={item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={item?.images[0]}
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
                    <h4>{t.dashboard.tables.ancientEgypt}</h4> /{" "}
                    <h4>{t.dashboard.tables.deserts}</h4>
                  </div>
                  <div className="item-overview">
                    <h4>
                      15000 <FaEye />
                    </h4>
                  </div>

                  <Link
                    href={`/discover/${placeGov?.id}`}
                    className="link"
                  >
                    <FaLocationDot />
                    {placeGov?.name}
                  </Link>

                  <div className="actions">
                    <Link href={`/places/${item?.id}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/places/form?edit=${item?.id}`}>
                      <MdEdit
                        className="edit"
                        title={t.dashboard.tables.edit}
                      />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => console.log("Delete item", item?.id)}
                    />
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
          nextText={t.dashboard.tables.next}
          prevText={t.dashboard.tables.prev}
          firstText={t.dashboard.tables.first}
          lastText={t.dashboard.tables.last}
        />
      </div>
    </div>
  );
}
