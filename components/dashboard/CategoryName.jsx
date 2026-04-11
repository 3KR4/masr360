"use client";
import { useState, useEffect } from "react";
import { getOne } from "@/services/categories/categories.service";

export default function CategoryName({ categoryId }) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        const res = await getOne(categoryId);
        setCategoryName(res.data?.name || "Unknown Category");
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setCategoryName("Unknown Category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) return <span>...</span>;
  return <span>{categoryName}</span>;
}
