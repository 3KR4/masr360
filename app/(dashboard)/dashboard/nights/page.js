"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { mainContext } from "@/Contexts/mainContext";
import useTranslate from "@/Contexts/useTranslation";
import { getAll, remove } from "@/services/nights/nights.service";
import { dashboard } from "@/Contexts/dashboard";
import { useNotification } from "@/Contexts/NotificationContext";
import { getAll as getCategories } from "@/services/categories/categories.service";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";

const DASHBOARD_LIST_IMAGE_PLACEHOLDER = "/images/dashboard-product-placeholder.svg";

export default function Nights() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const { selectedCats, searchText } = useContext(dashboard);
  const { addNotification } = useNotification();

  const [nights, setNights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [governorates, setGovernorates] = useState([]);
  const [governoratesLoading, setGovernoratesLoading] = useState(true);
  const limit = 6;

  const fetchNights = useCallback(async () => {
    try {
      setLoading(true);
      const governorateId =
        selectedCats.gov?._id || selectedCats.gov?.id || selectedCats.gov || "";
      const categoryId = selectedCats.cat?._id || selectedCats.cat?.id || "";
      const { nights: nightsData, totalCount } = await getAll(
        searchText,
        page,
        limit,
        locale,
        undefined,
        governorateId,
        categoryId,
      );
      setNights(nightsData || []);
      setPageCount(Math.max(1, Math.ceil((totalCount || 0) / limit)));
    } catch (error) {
      console.error("Error fetching nights:", error);
      setNights([]);
      setPageCount(1);
    } finally {
      setLoading(false);
    }
  }, [limit, locale, page, searchText, selectedCats]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const res = await getCategories({ type: "night", lang: locale });
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching night categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [locale]);

  const fetchGovernoratesData = useCallback(async () => {
    try {
      setGovernoratesLoading(true);
      const { governorates: govData } = await getGovernorates("", 1, 10000, locale);
      setGovernorates(govData || []);
    } catch (error) {
      console.error("Error fetching governorates:", error);
      setGovernorates([]);
    } finally {
      setGovernoratesLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    setPage(1);
  }, [locale, searchText, selectedCats.cat, selectedCats.gov, selectedCats.subCat]);

  useEffect(() => {
    fetchNights();
  }, [fetchNights]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchGovernoratesData();
  }, [fetchGovernoratesData]);

  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((category) => {
      map.set(category._id || category.id, category);
      if (category.subCategories) {
        category.subCategories.forEach((sub) => {
          map.set(sub._id || sub.id, { ...sub, parentName: category.name });
        });
      }
    });
    return map;
  }, [categories]);

  const getCategoryDisplayName = useCallback(
    (categoryData, subCategoryData) => {
      if (categoriesLoading) return t.dashboard?.tables?.loading || "Loading...";

      const categoryId = categoryData?._id || categoryData?.id || categoryData;
      const subCategoryId =
        subCategoryData?._id || subCategoryData?.id || subCategoryData;
      const categoryFromList = categoriesMap.get(categoryId);
      const subCategoryFromList = categoriesMap.get(subCategoryId);
      const localeKey = String(locale || "EN").toUpperCase();

      const catName =
        categoryData?.translations?.[localeKey]?.name ||
        categoryFromList?.translations?.[localeKey]?.name ||
        categoryData?.name ||
        categoryFromList?.name;
      const subCatName =
        subCategoryData?.translations?.[localeKey]?.name ||
        subCategoryFromList?.translations?.[localeKey]?.name ||
        subCategoryData?.name ||
        subCategoryFromList?.name;

      if (subCatName && catName) return `${catName} / ${subCatName}`;
      if (catName) return catName;
      return t.dashboard?.tables?.unknownCategory || "Unknown Category";
    },
    [categoriesLoading, categoriesMap, locale, t],
  );

  const getGovernorateDisplayName = useCallback(
    (governorateData) => {
      if (governoratesLoading) return t.dashboard?.tables?.loading || "Loading...";

      const govId = governorateData?._id || governorateData?.id || governorateData;
      const govFromList = governorates.find(
        (g) => String(g._id || g.id) === String(govId),
      );
      const localeKey = String(locale || "EN").toUpperCase();

      return (
        governorateData?.translations?.[localeKey]?.name ||
        govFromList?.translations?.[localeKey]?.name ||
        governorateData?.name ||
        govFromList?.name ||
        "Unknown Governorate"
      );
    },
    [governorates, governoratesLoading, locale, t],
  );

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
                <div className="header-item">{t.dashboard.tables.viewsCount}</div>
                <div className="header-item">{t.dashboard.tables.governorate}</div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            ) : (
              <div className="header-item" style={{ fontSize: "17px" }}>
                {t.dashboard.tables.cartItems}
              </div>
            )}
          </div>

          <div className="table-items">
            {nights.map((item) => {
              const itemId = item?._id || item?.id;
              const localeKey = String(locale || "EN").toUpperCase();
              const imageUrl = item?.imgs?.[0]?.url || item?.img?.url || "";
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
              const govId = item?.governorate?._id || item?.governorate?.id || item?.governorate;

              return (
                <div key={itemId} className="table-item">
                  <div className="holder">
                    <Link href={`/nights/${itemId}`} className="item-image">
                      <Image
                        src={imageUrl || DASHBOARD_LIST_IMAGE_PLACEHOLDER}
                        alt={itemName || "Night image"}
                        fill
                        className="product-image"
                      />
                    </Link>

                    <div className="item-details">
                      <Link href={`/nights/${itemId}`} className="item-name">
                        {itemName}
                      </Link>
                      <p className="description">{itemDescription}</p>
                    </div>
                  </div>

                  <div className="categories">
                    <h4>{getCategoryDisplayName(item?.category, item?.subCategory)}</h4>
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

                  <Link href={`/discover/${govId || ""}`} className="link">
                    <FaLocationDot />
                    {getGovernorateDisplayName(item?.governorate)}
                  </Link>

                  <div className="actions">
                    <Link href={`/nights/${itemId}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/nights/form?edit=${itemId}`}>
                      <MdEdit className="edit" title={t.dashboard.tables.edit} />
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

            {!loading && nights.length === 0 ? (
              <div className="table-item">
                <div className="holder">
                  <div className="item-details">
                    <p className="description">
                      {t.dashboard?.forms?.noResults || "No nights found"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
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
