"use client";
import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import * as cartService from "@/services/cart/cart.service";
import { normalizeCartItem } from "@/services/normalizers/productNormalizer";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cart = await cartService.getCart(user?._id || user?.id);
      const rawItems = cart?.items || [];
      setItems(rawItems.map(normalizeCartItem));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      try {
        const cart = await cartService.addToCart(productId, quantity);
        setItems((cart?.items || []).map(normalizeCartItem));
        return true;
      } catch (err) {
        console.error("Failed to add to cart:", err);
        return false;
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (productId, newQuantity) => {
      const current = items.find((i) => i.id === productId);
      if (!current) return;
      const delta = newQuantity - current.quantity;
      if (delta === 0) return;
      try {
        const cart = await cartService.updateCartItem(productId, delta);
        setItems((cart?.items || []).map(normalizeCartItem));
      } catch (err) {
        console.error("Failed to update cart item:", err);
      }
    },
    [items]
  );

  const removeItem = useCallback(async (productId) => {
    try {
      const cart = await cartService.removeCartItem(productId);
      setItems((cart?.items || []).map(normalizeCartItem));
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await cartService.clearCart();
      setItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }, []);

  const getItemPrice = useCallback((item) => {
    return item.sale > 0 ? item.price * (1 - item.sale / 100) : item.price;
  }, []);

  const getTotalPrice = useCallback(
    (item) => {
      return item.quantity * getItemPrice(item);
    },
    [getItemPrice]
  );

  const grandTotal = useMemo(() => {
    return items.reduce((total, item) => total + getTotalPrice(item), 0);
  }, [items, getTotalPrice]);

  const isInCart = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items]
  );

  const value = useMemo(
    () => ({
      carts: items,
      items,
      loading,
      setCarts: setItems,
      addItem,
      updateQuantity,
      removeItem,
      clearAll,
      getItemPrice,
      getTotalPrice,
      grandTotal,
      isInCart,
      refetch: fetchCart,
    }),
    [
      items,
      loading,
      addItem,
      updateQuantity,
      removeItem,
      clearAll,
      getItemPrice,
      getTotalPrice,
      grandTotal,
      isInCart,
      fetchCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
