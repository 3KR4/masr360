"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getNights } from "@/services/nights/nights.service";
import useCardHeight from "@/hooks/client/useCardHeight";

function Nights({ limitToShow = 9 }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [nights, setNights] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveLimit = screenSize === "small" ? 6 : limitToShow;
  const { gridRef, cardHeight } = useCardHeight([
    effectiveLimit,
    loading,
    nights,
  ]);

  const fetchNights = useCallback(async () => {
    setLoading(true);
    try {
      const fetchLimit = effectiveLimit || 9;
      const result = await getNights("", 1, fetchLimit, locale);
      setNights(result.nights || []);
    } catch (err) {
      console.error("Failed to fetch nights:", err);
      setNights([]);
    } finally {
      setLoading(false);
    }
  }, [locale, effectiveLimit]);

  useEffect(() => {
    fetchNights();
  }, [fetchNights]);

  if (!loading && nights.length < 3) return null;

  const displayNights = effectiveLimit
    ? nights.slice(0, effectiveLimit)
    : nights;

  return (
    <div className="nights">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.masr_nights.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.masr_nights.subtitle}</p>
        {!effectiveLimit && (
          <Link href={`/nights`} className="main-button">
            {t.sectionsTitles.masr_nights.btn}
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
            {displayNights.map((night) => (
              <CardItem key={night.id} item={night} type="night" />
            ))}
            {effectiveLimit && (
              <span
                className="overlay-layer"
                style={{ height: cardHeight ? `${cardHeight}px` : undefined }}
              />
            )}
            {effectiveLimit && (
              <Link
                href={`/nights`}
                style={{ bottom: cardHeight / 2 }}
                className="main-button back-light-animation"
              >
                {t.sectionsTitles.masr_nights.btn}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Nights;
