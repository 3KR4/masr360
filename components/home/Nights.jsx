"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getNights } from "@/services/nights/nights.service";

function Nights() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const [nights, setNights] = useState([]);

  const fetchNights = useCallback(async () => {
    try {
      const result = await getNights("", 1, 20, locale);
      setNights(result.nights || []);
    } catch (err) {
      console.error("Failed to fetch nights:", err);
      setNights([]);
    }
  }, [locale]);

  useEffect(() => {
    fetchNights();
  }, [fetchNights]);

  if (nights.length < 3) return null;

  return (
    <div className="nights">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.masr_nights.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.masr_nights.subtitle}</p>
        <Link href={`/nights`} className="main-button">
          {t.sectionsTitles.masr_nights.btn}
        </Link>
      </div>

      <div className="grid-holder container">
        {nights.map((night) => (
          <CardItem key={night.id} item={night} type="night" />
        ))}
      </div>
    </div>
  );
}

export default Nights;
