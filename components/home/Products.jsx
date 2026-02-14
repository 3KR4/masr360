"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { productsAr, productsEn } from "@/data";
import { mainContext } from "@/Contexts/mainContext";

function Products() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchproducts = async () => {
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
    fetchproducts();
  }, [locale]);

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

      <div className="grid-holder container">
        {products.slice(0, 10).map((product) => (
          <CardItem key={product.id} item={product} type="product" />
        ))}
      </div>
    </div>
  );
}

export default Products;
