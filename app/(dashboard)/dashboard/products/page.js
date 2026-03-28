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
import { getAll } from "@/services/porducts/products.service";

export default function Products() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAll({
          page,
          limit,
          search: "",
          lang: locale?.toLowerCase() || "en",
        });
        const response = res.data;

        setProducts(response?.products ?? (locale == "EN" ? productsEn : productsAr));
        setPageCount(Math.max(1, Math.ceil((response?.count ?? 0) / limit)));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts(locale == "EN" ? productsEn : productsAr);
        setPageCount(1);
      }
    };

    fetchProducts();
  }, [locale, page]);

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
            {products?.slice(0, 10).map((item) => {
              const productCat =
                locale == "EN"
                  ? productCategoriesEn?.find((x) => x.id == item?.category)
                  : productCategoriesAr?.find((x) => x.id == item?.category);
              const imageUrl = item?.imgs?.[0]?.url || item?.images?.[0] || "";
              const productName =
                item?.name || item?.translations?.[locale]?.name || "";
              return (
                <div key={item?._id || item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={productName}
                          fill
                          className="product-image"
                        />
                      ) : (
                        <div className="item-image-empty" />
                      )}
                    </Link>

                    <div className="item-details">
                      <Link href={`/market/${item?._id || item?.id}`} className="item-name">
                        {productName}
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
                      sale={item?.discount}
                      stock={item?.quantity}
                      qty={1}
                      dashboard={true}
                    />
                  </div>
                  <div className="item-rating">
                    <h4>{item?.reviewsCount} review</h4>
                    <div className="row-holder">
                      <Rating
                        name="read-only"
                        value={item?.avgRating}
                        precision={0.1}
                        readOnly
                        sx={{ color: "#ea8c43", fontSize: "19px" }}
                      />
                      <h4>({item?.avgRating})</h4>
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
                        item?.quantity == 0 ? "out" : item?.quantity < 10 ? "low" : ""
                      }`}
                    >
                      {item?.quantity}
                    </h4>
                  </div>

                  <div className="actions">
                    <Link href={`/marketplace/${item?._id || item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/products/form?edit=${item?._id || item?.id}`}>
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
          pageCount={pageCount}
          screenSize={screenSize}
          isDashBoard={true}
          onPageChange={(selectedPage) => {
            setPage(selectedPage.selected + 1);
          }}
        />
      </div>
    </div>
  );
}
