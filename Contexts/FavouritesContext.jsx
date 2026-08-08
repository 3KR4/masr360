"use client";
import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import * as favouritesService from "@/services/favourites/favourites.service";
import { normalizeProduct } from "@/services/normalizers/productNormalizer";

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [allFavourites, setAllFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavourites = useCallback(async () => {
    if (!isAuthenticated) {
      setAllFavourites([]);
      return;
    }
    setLoading(true);
    try {
      const favs = await favouritesService.getMyFavourites("Product");
      setAllFavourites(favs);
    } catch (err) {
      console.error("Failed to fetch favourites:", err);
      setAllFavourites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const favoritesProducts = useMemo(
    () =>
      allFavourites
        .filter((f) => f.type === "Product")
        .map((f) => normalizeProduct(f.targetId)),
    [allFavourites]
  );

  const favoritesPlaces = useMemo(
    () => allFavourites.filter((f) => f.type === "Place").map((f) => f.targetId),
    [allFavourites]
  );

  const toggleItem = useCallback(
    async (type, targetId) => {
      try {
        await favouritesService.toggleFavourite(type, targetId);
        await fetchFavourites();
      } catch (err) {
        console.error("Failed to toggle favourite:", err);
      }
    },
    [fetchFavourites]
  );

  const removeItem = useCallback(
    async (type, id) => {
      try {
        await favouritesService.toggleFavourite(type, id);
        await fetchFavourites();
      } catch (err) {
        console.error("Failed to remove favourite:", err);
      }
    },
    [fetchFavourites]
  );

  const isFavorited = useCallback(
    (type, id) => {
      return allFavourites.some(
        (f) => f.type === type && (f.targetId?._id || f.targetId) === id
      );
    },
    [allFavourites]
  );

  const value = useMemo(
    () => ({
      favoritesProducts,
      favoritesPlaces,
      favorites: allFavourites,
      loading,
      toggleItem,
      removeItem,
      isFavorited,
      refetch: fetchFavourites,
    }),
    [
      favoritesProducts,
      favoritesPlaces,
      allFavourites,
      loading,
      toggleItem,
      removeItem,
      isFavorited,
      fetchFavourites,
    ]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
};

export const useFavoriet = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavoriet must be used within FavouritesProvider");
  }
  return ctx;
};
