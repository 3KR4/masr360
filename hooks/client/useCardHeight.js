"use client";

import { useState, useEffect, useRef } from "react";

export default function useCardHeight(dependencies = []) {
  const gridRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const measureCard = () => {
      const cardEl = el.querySelector(".card");
      if (cardEl && cardEl.offsetHeight > 0) {
        setCardHeight(cardEl.offsetHeight);
      }
    };

    measureCard();

    // Use ResizeObserver for instant updates when layout or window size changes
    const observer = new ResizeObserver(() => {
      measureCard();
    });

    observer.observe(el);
    const cardEl = el.querySelector(".card");
    if (cardEl) {
      observer.observe(cardEl);
    }

    window.addEventListener("resize", measureCard);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureCard);
    };
  }, dependencies);

  return { gridRef, cardHeight: cardHeight + 1 };
}
