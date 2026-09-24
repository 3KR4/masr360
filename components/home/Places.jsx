"use client";
import React from "react";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { getAll as getPlaces } from "@/services/places/places.service";
import { mainContext } from "@/Contexts/mainContext";
import useCardHeight from "@/hooks/client/useCardHeight";

function Places({ limitToShow = 12 }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveLimit = screenSize === "small" ? 6 : limitToShow;
  const { gridRef, cardHeight } = useCardHeight([
    effectiveLimit,
    loading,
    places,
  ]);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const fetchLimit = effectiveLimit || 12;
        const { places } = await getPlaces("", 1, fetchLimit, locale);
        setPlaces(places || []);
      } catch (err) {
        console.error("Failed to fetch places:", err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [locale, effectiveLimit]);

  if (!loading && places.length < 3) return null;

  const displayPlaces = effectiveLimit
    ? places.slice(0, effectiveLimit)
    : places;

  return places.length < 3 ? null : (
    <div className="places">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.top_attractions.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.top_attractions.subtitle}</p>
        {!effectiveLimit && (
          <Link href="/places" className="main-button">
            {t.sectionsTitles.top_attractions.btn}
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
            {displayPlaces.map((place) => (
              <CardItem key={place.id} item={place} type="place" />
            ))}

            {effectiveLimit && (
              <span
                className="overlay-layer"
                style={{ height: cardHeight ? `${cardHeight}px` : undefined }}
              />
            )}

            {effectiveLimit && (
              <Link
                href="/places"
                style={{ bottom: cardHeight / 2 }}
                className="main-button back-light-animation"
              >
                {t.sectionsTitles.top_attractions.btn}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Places;
