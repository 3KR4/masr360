import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import Pagination from "@/components/settings/Pagination";
import Image from "next/image";
import "@/styles/pages/cart.css";
import "@/styles/pages/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { mainContext } from "@/Contexts/mainContext";
import { dashboard } from "@/Contexts/dashboard";
import { placesAr, placesEn, governoratesEn, governoratesAr } from "@/data";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { getAll, remove } from "@/services/places/places.service";
import { useNotification } from "@/Contexts/NotificationContext";
import { getAll as getCategories } from "@/services/categories/categories.service";
export default function Places() {
  const { screenSize, locale } = useContext(mainContext);
  const { searchText, selectedCats } = useContext(dashboard);

  const t = useTranslate();
  const localPlaces = locale === "EN" ? placesEn : placesAr;
  const [places, setPlaces] = useState([]);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [pageCount, setPageCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);

      const governorateId = selectedCats.gov || "";
      const categoryId = selectedCats.cat?.id || "";

      const res = await getAll(
        searchText,
        page,
        limit,
        locale,
        "createdAt,desc",
        governorateId,
        categoryId
      );
      const response = res.data;

      setPlaces(response?.places ?? []);

      const total = response?.count ?? 0;
      setPageCount(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchText, limit, locale, selectedCats]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const res = await getCategories({ type: "places", lang: locale });
      const response = res.data.data || res.data;
      setCategories(response || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      map.set(category._id, category);
      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          map.set(sub._id, { ...sub, parentName: category.name });
        });
      }
    });
    return map;
  }, [categories]);

  const getCategoryDisplayName = useCallback((categoryId, subCategoryId) => {
    if (categoriesLoading) return t.dashboard.tables.loading || "Loading...";

    const category = categoriesMap.get(categoryId);
    const subCategory = categoriesMap.get(subCategoryId);

    if (subCategory && subCategory.parentName) {
      return `${subCategory.parentName} / ${subCategory.name}`;
    } else if (category) {
      return category.name;
    } else {
      return t.dashboard.tables.unknownCategory || "Unknown Category";
    }
  }, [categoriesMap, categoriesLoading, t]);

 const deletePlaces = async (id) => {
    try {
      await remove(id);

      await fetchPlaces(); 

      addNotification({
        type: "success",
        message: "Place has been deleted successfully",
      });
    } catch (error) {
      console.error(error);
      addNotification({
        type: "warning",
        message: error.response?.data?.message || "Something went wrong ❌",
      });
    }
  };

  console.log(places.length);
  

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
              const localeKey = String(locale || "EN").toUpperCase();
              const placeEntry = localPlaces.find(
                (x) => String(x.id) === String(item?._id) || x.name === item?.name,
              );
              const placeGov =
                locale == "EN"
                  ? governoratesEn?.find((x) => x.id == item?.governorate?._id)
                  : governoratesAr?.find((x) => x.id == item?.governorate?._id);
              const imageUrl = item?.imgs?.[0]?.url || placeEntry?.images?.[0];
              const placeName =
                item?.translations?.[localeKey]?.name ||
                item?.name ||
                item?.translations?.EN?.name ||
                item?.translations?.AR?.name ||
                placeEntry?.name ||
                "";
              const placeDescription =
                item?.translations?.[localeKey]?.desc ||
                item?.desc ||
                item?.description ||
                item?.translations?.EN?.desc ||
                item?.translations?.AR?.desc ||
                placeEntry?.description ||
                "";
              return (
                <div key={item?._id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={placeName || "Place image"}
                          fill
                          className="product-image"
                        />
                      ) : (
                        <div className="item-image-empty" />
                      )}
                    </Link>

                    <div className="item-details">
                      <Link href={`/`} className="item-name">
                        {placeName}
                      </Link>
                      <p className="description">{placeDescription}</p>
                    </div>
                  </div>
                  <div className="categories">
                    <h4>{getCategoryDisplayName(item?.category, item?.subCategory)}</h4>
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
                    <Link href={`/places/${item?._id}`}>
                      <FaEye className="view" title={t.dashboard.tables.view} />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/places/form?edit=${item?._id}`}>
                      <MdEdit
                        className="edit"
                        title={t.dashboard.tables.edit}
                      />
                    </Link>
                    <hr />
                    <FaTrashAlt
                      className="delete"
                      title={t.dashboard.tables.delete}
                      onClick={() => deletePlaces(item?._id)}
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
        />
      </div>
    </div>
  );
}
