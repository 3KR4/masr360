"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import { mainContext } from "@/Contexts/mainContext";
import useCardHeight from "@/hooks/client/useCardHeight";

function Governorates({ limitToShow = 9 }) {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [governorates, setgovernorates] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectiveLimit = screenSize === "small" ? 6 : limitToShow;
  const { gridRef, cardHeight } = useCardHeight([
    effectiveLimit,
    loading,
    governorates,
  ]);

  useEffect(() => {
    const fetchgovernorates = async () => {
      setLoading(true);
      try {
        const fetchLimit = effectiveLimit || 9;
        const { governorates } = await getGovernorates(
          "",
          1,
          fetchLimit,
          locale,
        );
        setgovernorates(governorates || []);
      } catch (err) {
        console.error("Failed to fetch governorates:", err);
        setgovernorates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchgovernorates();
  }, [locale, effectiveLimit]);

  if (!loading && governorates.length < 3) return null;

  const displayGovernorates = effectiveLimit
    ? governorates.slice(0, effectiveLimit)
    : governorates;

  return (
    <div className="governorates">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.discover_egypt.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.discover_egypt.subtitle}</p>
        {!effectiveLimit && (
          <Link href={`/discover`} className="main-button">
            {t.sectionsTitles.discover_egypt.btn}
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
            {displayGovernorates.map((gov) => (
              <CardItem key={gov.id} item={gov} type="gov" />
            ))}
            {effectiveLimit && (
              <span
                className="overlay-layer"
                style={{ height: cardHeight ? `${cardHeight}px` : undefined }}
              />
            )}
            {effectiveLimit && (
              <Link
                href={`/discover`}
                style={{ bottom: cardHeight / 2 }}
                className="main-button back-light-animation"
              >
                {t.sectionsTitles.discover_egypt.btn}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Governorates;
