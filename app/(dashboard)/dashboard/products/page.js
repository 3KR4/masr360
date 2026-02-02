"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";
import useTranslate from "@/Contexts/useTranslation";

import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import DisplayPrice from "@/components/DisplayPrice";
import { mainContext } from "@/Contexts/mainContext";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";

import {
  productsEn,
  productsAr,
  productCategoriesEn,
  productCategoriesAr,
} from "@/data";

export default function Products() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchevents = async () => {
      // try {
      //   const { data } = await getService.getProducts(6);
      //   setProducts(
      //     data || locale == "en" ? productsEn : productsAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setProducts(locale == "en" ? productsEn : productsAr);
      // }
      setProducts(locale == "en" ? productsEn : productsAr);
    };
    fetchevents();
  }, [locale]);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container products">
          <div className="table-header">
            {screenSize !== "small" ? (
              <>
                <div className="header-item details">
                  {t.favorites.tableHeaders.product.details}
                </div>
                <div className="header-item">{t.dashboard.forms.price}</div>
                <div className="header-item">{t.dashboard.tables.reviews}</div>
                <div className="header-item">{t.orders.status}</div>
                <div className="header-item">{t.dashboard.forms.stock}</div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                cart items
              </div>
            )}
          </div>

          <div className="table-items">
            {products.slice(0, 10).map((item) => {
              const productCat =
                locale == "en"
                  ? productCategoriesEn?.find((x) => x.id == item?.category)
                  : productCategoriesAr?.find((x) => x.id == item?.category);
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
                      <Link href={`/market/${item?.id}`} className="item-name">
                        {item?.name}
                      </Link>
                      {screenSize !== "small" && (
                        <>
                          <Link
                            href={`/market?cat=${productCat?.id}`}
                            className="link"
                          >
                            <span>
                              {t.favorites.tableHeaders.product.category}:
                            </span>{" "}
                            {productCat?.name}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    <DisplayPrice
                      price={item?.price}
                      sale={item?.sale}
                      stock={item?.stock}
                      qty={item?.quantity}
                      dashboard={true}
                    />
                  </div>
                  <div className="item-rating">
                    <h4>{item?.reviewsCount} review</h4>
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
                      3000 <FaEye />
                    </h4>
                    <h4 className="green">
                      1500 <BiSolidPurchaseTagAlt />
                    </h4>
                  </div>
                  <div className="item-stock">
                    <h4
                      className={`${
                        item?.stock == 0 ? "out" : item?.stock < 10 ? "low" : ""
                      }`}
                    >
                      {item?.stock}
                    </h4>
                  </div>

                  <div className="actions">
                    <Link href={`/marketplace/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/products/form?edit=${item?.id}`}>
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
