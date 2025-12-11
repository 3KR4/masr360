"use client";
import { useState, useMemo } from "react";
import { products } from "@/data";

export default function useCart() {
  const [favorites, setFavorites] = useState(
    products.slice(0, 6).map((product) => ({
      ...product,
      quantity: 1,
    }))
  );

  // تحديث الكمية
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setFavorites((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // حذف عنصر
  const removeItem = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // السعر بعد الخصم
  const getItemPrice = (item) => {
    return item.sale > 0 ? item.price * (1 - item.sale / 100) : item.price;
  };

  // سعر المنتج × الكمية
  const getTotalPrice = (item) => {
    const basePrice = getItemPrice(item);
    return item.quantity * basePrice;
  };

  // المجموع النهائي
  const grandTotal = useMemo(() => {
    return favorites.reduce((total, item) => total + getTotalPrice(item), 0);
  }, [favorites]);

  return {
    favorites,
    setFavorites,
    updateQuantity,
    removeItem,
    getItemPrice,
    getTotalPrice,
    grandTotal,
  };
}
