"use client";
import { useState, useContext, useEffect } from "react";
import { productsEn, productsAr, placesEn, placesAr } from "@/data";
import { mainContext } from "@/Contexts/mainContext";

export default function useFavoriet() {
  const { locale } = useContext(mainContext);

  const products = locale === "EN" ? productsEn : productsAr;
  const places = locale === "EN" ? placesEn : placesAr;

  const [favoritesProducts, setFavoritesProducts] = useState([]);
  const [favoritesPlaces, setFavoritesPlaces] = useState([]);

  // 🔁 تحديث البيانات عند تغيير اللغة
  useEffect(() => {
    setFavoritesProducts(
      products.slice(0, 4).map((product) => ({
        ...product,
        quantity: 1,
      })),
    );

    setFavoritesPlaces(places.slice(0, 3));
  }, [locale]); // 👈 المفتاح هنا

  const removeItem = (type, id) => {
    if (type === "place") {
      setFavoritesPlaces((prev) => prev.filter((item) => item.id !== id));
    } else if (type === "product") {
      setFavoritesProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return {
    favoritesProducts,
    setFavoritesProducts,
    favoritesPlaces,
    setFavoritesPlaces,
    removeItem,
  };
}
