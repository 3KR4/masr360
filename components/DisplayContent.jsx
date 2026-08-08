"use client";
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import CardItem from "@/components/CardItem";
import ListItem from "@/components/ListItem";
import Filters from "@/components/settings/Filters";
import Pagination from "@/components/settings/Pagination";
import "@/styles/pages/discover.css";
import "@/styles/components/list-item.css";
import { IoIosClose } from "react-icons/io";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getProducts } from "@/services/porducts/products.service";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import { getAll as getPlaces } from "@/services/places/places.service";
import { getAll as getNights } from "@/services/nights/nights.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";
import useTranslate from "@/Contexts/useTranslation";
import { FaList } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import SelectOptions from "@/components/dashboard/forms/SelectOptions";
import { useRouter, useSearchParams } from "next/navigation";

const PRODUCT_SORT_OPTIONS = [
  { value: "createdAt,desc", labelEn: "Newest", labelAr: "الأحدث" },
  { value: "price,asc", labelEn: "Price: Low to High", labelAr: "السعر: من الأقل للأعلى" },
  { value: "price,desc", labelEn: "Price: High to Low", labelAr: "السعر: من الأعلى للأقل" },
  { value: "avgRating,desc", labelEn: "Top Rated", labelAr: "الأعلى تقييماً" },
];

const PLACE_SORT_OPTIONS = [
  { value: "createdAt,desc", labelEn: "Newest", labelAr: "الأحدث" },
  { value: "name,asc", labelEn: "Name: A to Z", labelAr: "الاسم: أ - ي" },
  { value: "name,desc", labelEn: "Name: Z to A", labelAr: "الاسم: ي - أ" },
];

const NIGHT_SORT_OPTIONS = [
  { value: "createdAt,desc", labelEn: "Newest", labelAr: "الأحدث" },
  { value: "avgRating,desc", labelEn: "Top Rated", labelAr: "الأعلى تقييماً" },
  { value: "name,asc", labelEn: "Name: A to Z", labelAr: "الاسم: أ - ي" },
  { value: "name,desc", labelEn: "Name: Z to A", labelAr: "الاسم: ي - أ" },
];

const LIMIT_OPTIONS = [12, 24, 48, 96];

const getSortOptions = (locale, type) => {
  const list =
    type === "place"
      ? PLACE_SORT_OPTIONS
      : type === "night"
        ? NIGHT_SORT_OPTIONS
        : PRODUCT_SORT_OPTIONS;
  return list.map((opt) => ({
    id: opt.value,
    name: locale === "AR" ? opt.labelAr : opt.labelEn,
  }));
};

const getLimitOptions = () =>
  LIMIT_OPTIONS.map((n) => ({ id: n, name: String(n) }));

export default function DisplayContent({ type, isSharedData = false, shared }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(() => Number(searchParams.get("limit")) || 12);
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "createdAt,desc");
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("marketplace_viewMode") || "grid";
    }
    return "grid";
  });
  const [availability, setAvailability] = useState(() => {
    const stock = searchParams.get("stock");
    if (stock === "in") return "inStock";
    if (stock === "out") return "outOfStock";
    return null;
  });
  const [priceRange, setPriceRange] = useState(() => {
    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || 10000;
    return [min, max];
  });
  const [selectedCategory, setSelectedCategory] = useState(() => ({
    catId: searchParams.get("category") || null,
    subCatId: searchParams.get("subCategory") || null,
    catLabel: searchParams.get("catLabel") || null,
    subCatLabel: searchParams.get("subCatLabel") || null,
  }));
  const isProduct = type === "product";
  const isGov = type === "gov";
  const isPlace = type === "place";
  const isNight = type === "night";

  const activeGovernorate =
    isPlace || isNight ? shared || searchParams.get("governorateId") || "" : "";

  const buildUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("lang", locale);
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sort", sortBy);
    if (isProduct && availability === "inStock") params.set("stock", "in");
    if (isProduct && availability === "outOfStock") params.set("stock", "out");
    if (isProduct && priceRange[0] !== 0) params.set("minPrice", String(priceRange[0]));
    if (isProduct && priceRange[1] !== 10000) params.set("maxPrice", String(priceRange[1]));
    if (selectedCategory.catId) params.set("category", selectedCategory.catId);
    if (selectedCategory.subCatId) params.set("subCategory", selectedCategory.subCatId);
    if (selectedCategory.catLabel) params.set("catLabel", selectedCategory.catLabel);
    if (selectedCategory.subCatLabel) params.set("subCatLabel", selectedCategory.subCatLabel);
    if (activeGovernorate) params.set("governorateId", activeGovernorate);
    return params.toString();
  }, [page, limit, sortBy, availability, priceRange, selectedCategory, locale, isProduct, activeGovernorate]);

  useEffect(() => {
    if (isGov) return;
    const qs = buildUrlParams();
    router.replace(`?${qs}`, { scroll: false });
  }, [buildUrlParams, router, isGov]);

  useEffect(() => {
    localStorage.setItem("marketplace_viewMode", viewMode);
  }, [viewMode]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isGov) {
        const result = await getGovernorates("", page, limit, locale);
        setData(result.governorates || []);
        setTotalCount(result.totalCount || 0);
        return;
      }
      if (isPlace) {
        const result = await getPlaces(
          "",
          page,
          limit,
          locale,
          sortBy,
          activeGovernorate,
          selectedCategory.catId || "",
          selectedCategory.subCatId || ""
        );
        setData(result.places || []);
        setTotalCount(result.totalCount || 0);
        return;
      }
      if (isNight) {
        const result = await getNights(
          "",
          page,
          limit,
          locale,
          sortBy,
          activeGovernorate,
          selectedCategory.catId || "",
          selectedCategory.subCatId || ""
        );
        setData(result.nights || []);
        setTotalCount(result.totalCount || 0);
        return;
      }
      if (!isProduct) {
        setData([]);
        setTotalCount(0);
        return;
      }
      const params = {
        page,
        limit,
        lang: locale,
        sort: sortBy,
      };
      if (priceRange[0] !== 0) params.minPrice = priceRange[0];
      if (priceRange[1] !== 10000) params.maxPrice = priceRange[1];
      if (availability === "inStock") params.stock = "in";
      if (availability === "outOfStock") params.stock = "out";
      if (selectedCategory.catId) params.category = selectedCategory.catId;
      if (selectedCategory.subCatId) params.subCategory = selectedCategory.subCatId;

      const result = await getProducts(params);
      setData((result.products || []).map(normalizeProduct));
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, availability, priceRange, selectedCategory, locale, isProduct, isGov, isPlace, isNight, activeGovernorate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [availability, priceRange, selectedCategory, sortBy, limit]);

  const handleRemoveFilter = (filter) => {
    if (filter === "availability") setAvailability(null);
    if (filter === "price") setPriceRange([0, 10000]);
    if (filter === "cat")
      setSelectedCategory({ catId: null, subCatId: null, catLabel: null, subCatLabel: null });
    if (filter === "subCat")
      setSelectedCategory((prev) => ({ ...prev, subCatId: null, subCatLabel: null }));
  };

  const hasActiveFilters =
    availability ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    selectedCategory.catId ||
    selectedCategory.subCatId;

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedSort = getSortOptions(locale, type).find((o) => o.id === sortBy) || null;
  const selectedLimit = getLimitOptions().find((o) => o.id === limit) || null;

  return (
    <div className="fluid-container big-holder">
      {type !== "gov" && (
        <Filters
          availability={availability}
          priceRange={priceRange}
          selectedCategory={selectedCategory}
          setAvailability={setAvailability}
          setPriceRange={setPriceRange}
          setSelectedCategory={setSelectedCategory}
          showAvailability={isProduct}
          catsType={type}
          screenSize={screenSize}
          active={openFilters}
          setActive={setOpenFilters}
        />
      )}

      <div className="holder">
        {(isProduct || isPlace || isNight) && (
          <div className="sort-bar">
            <div className="sort-bar-left">
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <IoGrid />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <FaList />
                </button>
              </div>
            </div>
            <div className="sort-bar-right">
              <SelectOptions
                className="marketplace-sort-select marketplace-limit-select"
                options={getLimitOptions()}
                value={selectedLimit}
                onChange={(opt) => setLimit(opt.id)}
                placeholder="count per page"
                valuePrefix="Limit: "
              />

              <SelectOptions
                className="marketplace-sort-select"
                options={getSortOptions(locale, type)}
                value={selectedSort}
                onChange={(opt) => setSortBy(opt.id)}
                placeholder="Sort by"
                valuePrefix="Sort by: "
              />
            </div>
          </div>
        )}

        {type !== "gov" && (screenSize !== "large" || hasActiveFilters) && (
          <div className="selected-filters">
            <strong
              onClick={() => screenSize !== "large" && setOpenFilters(true)}
              className={screenSize !== "large" ? "main-button" : ""}
            >
              {t.marketplace.selected_filters}
            </strong>

            {availability && (
              <p onClick={() => handleRemoveFilter("availability")}>
                {t.marketplace.availability}: {t.cart[availability]}
                <IoIosClose className="remove" />
              </p>
            )}

            {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
              <p onClick={() => handleRemoveFilter("price")}>
                {t.dashboard.forms.price}: {priceRange[0]} - {priceRange[1]}
                <IoIosClose className="remove" />
              </p>
            )}

            {selectedCategory.catLabel && (
              <p onClick={() => handleRemoveFilter("cat")}>
                {t.dashboard.forms.category}: {selectedCategory.catLabel}
                <IoIosClose className="remove" />
              </p>
            )}

            {selectedCategory.subCatLabel && (
              <p onClick={() => handleRemoveFilter("subCat")}>
                {t.dashboard.forms.subCategory}: {selectedCategory.subCatLabel}
                <IoIosClose className="remove" />
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>{t.dashboard.forms.loading || "Loading..."}</p>
          </div>
        ) : viewMode === "list" && (isProduct || isPlace || isNight) ? (
          <div className="list-holder">
            {data.map((item) => (
              <ListItem key={item.id} item={item} type={type} />
            ))}
            {data.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>{t.marketplace.no_results || "No products found"}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid-holder">
            {data.map((item) => (
              <CardItem key={item.id} item={item} type={type} />
            ))}
            {data.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", gridColumn: "1 / -1" }}>
                <p>{t.marketplace.no_results || "No products found"}</p>
              </div>
            )}
          </div>
        )}

        {(isProduct || isGov || isPlace || isNight) && totalCount > limit && (
          <Pagination
            pageCount={Math.ceil(totalCount / limit)}
            screenSize={screenSize}
            onPageChange={handlePageChange}
            forcePage={page - 1}
          />
        )}
      </div>
    </div>
  );
}
