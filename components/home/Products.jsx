"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getProducts } from "@/services/porducts/products.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";

function Products() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts({
          page: 1,
          limit: 10,
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
  }, [locale]);

  if (!loading && products.length < 3) return null;

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
        <Link href={`/marketplace`} className="main-button">
          {t.sectionsTitles.popular_products.btn}
        </Link>
      </div>

      {loading ? (
        <div className="container" style={{ textAlign: "center", padding: "40px" }}>
          <p>{t.dashboard.forms.loading || "Loading..."}</p>
        </div>
      ) : (
        <div className="grid-holder container">
          {products.map((product) => (
            <CardItem key={product.id} item={product} type="product" />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
