"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getProducts } from "@/services/porducts/products.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";
import useCardHeight from "@/hooks/client/useCardHeight";

function Products({ limitToShow = 12 }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveLimit = screenSize === "small" ? 6 : limitToShow;
  const { gridRef, cardHeight } = useCardHeight([
    effectiveLimit,
    loading,
    products,
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchLimit = effectiveLimit || 12;
        const result = await getProducts({
          page: 1,
          limit: fetchLimit,
          sort: "createdAt,desc",
          lang: locale,
        });
        setProducts((result.products || []).map(normalizeProduct));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [locale, effectiveLimit]);

  if (!loading && products.length < 3) return null;

  const displayProducts = effectiveLimit
    ? products.slice(0, effectiveLimit)
    : products;

  return (
    <div className="products">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.popular_products.title}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.popular_products.subtitle}
        </p>
        {!effectiveLimit && (
          <Link href={`/marketplace`} className="main-button">
            {t.sectionsTitles.popular_products.btn}
          </Link>
        )}
      </div>

      <div
        ref={gridRef}
        className={`grid-holder container ${effectiveLimit ? "limit-to-show" : ""}`}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              gridColumn: "1 / -1",
            }}
          >
            <p>{t.dashboard.forms.loading || "Loading..."}</p>
          </div>
        ) : (
          <>
            {displayProducts.map((product) => (
              <CardItem key={product.id} item={product} type="product" />
            ))}
            {effectiveLimit && (
              <span
                className="overlay-layer"
                style={{ height: cardHeight ? `${cardHeight}px` : undefined }}
              />
            )}
            {effectiveLimit && (
              <Link
                href={`/marketplace`}
                style={{ bottom: cardHeight / 2 }}
                className="main-button back-light-animation"
              >
                {t.sectionsTitles.popular_products.btn}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
