"use client";
import React from "react";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { getAll as getPlaces } from "@/services/places/places.service";

import { mainContext } from "@/Contexts/mainContext";

function Places() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const { places } = await getPlaces("", 1, 12, locale);
        setPlaces(places || []);
      } catch (err) {
        console.error("Failed to fetch places:", err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [locale]);

  if (!loading && places.length < 3) return null;

  return places.length < 3 ? null : (
    <div className="places">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.top_attractions.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.top_attractions.subtitle}</p>
        <Link href={`/places`} className="main-button">
          {t.sectionsTitles.top_attractions.btn}
        </Link>
      </div>

      <div className="grid-holder container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", gridColumn: "1 / -1" }}>
            <p>{t.dashboard.forms.loading || "Loading..."}</p>
          </div>
        ) : (
          places.slice(0, 12).map((place) => (
            <CardItem key={place.id} item={place} type="place" />
          ))
        )}
      </div>
    </div>
  );
}

export default Places;
