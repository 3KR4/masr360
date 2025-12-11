"use client";
import { useState, useMemo } from "react";
import { products, places } from "@/data";

export default function useFavoriet() {
  const [favoritesProducts, setFavoritesProducts] = useState(
    products.slice(0, 4).map((product) => ({
      ...product,
      quantity: 1,
    }))
  );
  const [favoritesPlaces, setFavoritesPlaces] = useState(places.slice(0, 3));

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
