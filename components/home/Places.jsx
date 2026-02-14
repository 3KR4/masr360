"use client";
import React from "react";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import { FaHeart } from "react-icons/fa";
import { placesAr, placesEn } from "@/data";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";

import { mainContext } from "@/Contexts/mainContext";

function Places() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      // try {
      //   const { data } = await getService.getPlaces(8);
      //   setPlaces(data || []);
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setPlaces([]);
      // }

      setPlaces(locale == "en" ? placesEn : placesAr);
    };
    fetchPlaces();
  }, [locale]);

  return (
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
        {places.slice(0, 12).map((place) => (
          <CardItem key={place.id} item={place} type="place" />
        ))}
      </div>
    </div>
  );
}

export default Places;
