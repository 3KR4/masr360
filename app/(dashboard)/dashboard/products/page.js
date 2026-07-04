"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { useNotification } from "@/Contexts/NotificationContext";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import DisplayPrice from "@/components/DisplayPrice";
import { mainContext } from "@/Contexts/mainContext";
import { dashboard } from "@/Contexts/dashboard";
import { getAll, remove } from "@/services/porducts/products.service";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";

const DASHBOARD_LIST_IMAGE_PLACEHOLDER =
  "/images/dashboard-product-placeholder.svg";

export default function Products() {
  const { screenSize, locale, productCategories } = useContext(mainContext);
  const { searchText, selectedCats } = useContext(dashboard);
  const t = useTranslate();
  const { addNotification } = useNotification();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  const categoriesMap = useMemo(() => {
    const map = new Map();
    (productCategories || []).forEach((category) => {
      map.set(category._id || category.id, category);
    });
    return map;
  }, [productCategories]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const categoryId =
        selectedCats.category?._id || selectedCats.category?.id || "";
      const subCategoryId =
        selectedCats.subCat?._id ||
        selectedCats.subCat?.id ||
        selectedCats.subCat ||
        "";
      const { products: productsData, totalCount } = await getAll({
        page,
        limit,
        search: searchText?.trim() || "",
        category: categoryId,
        subCategory: subCategoryId,
        lang: locale?.toLowerCase() || "en",
      });
      setProducts(productsData || []);
      setTotalCount(totalCount || 0);
      setPageCount(Math.max(1, Math.ceil((totalCount || 0) / limit)));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [
    limit,
    locale,
    page,
    searchText,
    selectedCats.category,
    selectedCats.subCat,
  ]);

  const getCategoryDisplayName = useCallback(
    (categoryData) => {
      const localeKey = String(locale || "EN").toUpperCase();
      const categoryId = categoryData?._id || categoryData?.id || categoryData;
      const categoryFromList = categoriesMap.get(categoryId);

      return (
        categoryData?.translations?.[localeKey]?.name ||
        categoryFromList?.translations?.[localeKey]?.name ||
        categoryData?.name ||
        categoryFromList?.name ||
        t.dashboard?.tables?.unknownCategory ||
        "Unknown Category"
      );
    },
    [categoriesMap, locale, t],
  );

  const deleteProduct = async (id) => {
    try {
      await remove(id);
      await fetchProducts();
      addNotification({
        type: "success",
        message: "Product has been deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete product:", err);
      addNotification({
        type: "warning",
        message: err.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [locale, searchText, selectedCats.category, selectedCats.subCat]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
                {t.dashboard.tables.cartItems}
              </div>
            )}
          </div>

          <div className="table-items">
            {products.map((item) => {
              const localeKey = String(locale || "EN").toUpperCase();
              const imageUrl = item?.imgs?.[0]?.url || item?.images?.[0] || "";
              const productId = item?._id || item?.id;
              const productName =
                item?.translations?.[localeKey]?.name ||
                item?.name ||
                item?.translations?.EN?.name ||
                item?.translations?.AR?.name ||
                "";

              const viewsCount =
                item?.viewsCount || item?.views || item?.viewCount || 0;
              const salesCount =
                item?.salesCount || item?.ordersCount || item?.soldCount || 0;

              return (
                <div key={productId} className="table-item">
                  <div className="holder">
                    <Link
                      href={`/marketplace/${productId}`}
                      className="item-image"
                    >
                      <Image
                        src={imageUrl || DASHBOARD_LIST_IMAGE_PLACEHOLDER}
                        alt={productName || "Product image"}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link
                        href={`/marketplace/${productId}`}
                        className="item-name"
                      >
                        {productName}
                      </Link>
                      {screenSize !== "small" ? (
                        <Link
                          href={`/marketplace?cat=${item?.category?._id || item?.category}`}
                          className="link product-category-link"
                        >
                          {getCategoryDisplayName(item?.category)}
                        </Link>
                      ) : null}
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
                    <h4>
                      {item?.reviewsCount || 0} {t.dashboard.tables.review}
                    </h4>
                    <div className="row-holder">
                      <Rating
                        name="read-only"
                        value={item?.avgRating || 0}
                        precision={0.1}
                        readOnly
                        sx={{ color: "#ea8c43", fontSize: "19px" }}
                      />
                      <h4>({item?.avgRating || 0})</h4>
                    </div>
                  </div>

                  <div className="item-overview">
                    <h4>
                      {viewsCount} <FaEye />
                    </h4>
                    <h4 className="green">
                      {salesCount} <BiSolidPurchaseTagAlt />
                    </h4>
                  </div>

                  <div className="item-stock">
                    <h4
                      className={
                        item?.quantity == 0
                          ? "out"
                          : item?.quantity < 10
                            ? "low"
                            : ""
                      }
                    >
                      {item?.quantity}
                    </h4>
                  </div>

                  <div className="actions">
                    <Link href={`/marketplace/${productId}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/products/form?edit=${productId}`}>
                      <MdEdit
                        className="edit"
                        title={t.dashboard.tables.edit}
                      />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => deleteProduct(productId)}
                    />
                  </div>
                </div>
              );
            })}

            {!loading && products.length === 0 ? (
              <div className="table-item">
                <div className="holder">
                  <div className="item-details">
                    <p className="description">
                      {t.dashboard?.forms?.noResults || "No products found"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {totalCount > limit && (
          <Pagination
            pageCount={pageCount}
            screenSize={screenSize}
            isDashBoard={true}
            onPageChange={(selectedPage) => {
              setPage(selectedPage.selected + 1);
            }}
          />
        )}
      </div>
    </div>
  );
}
