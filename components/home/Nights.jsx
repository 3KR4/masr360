"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { nightsEn, nightsAr } from "@/data";
import { mainContext } from "@/Contexts/mainContext";

function Nights() {
  const { locale } = useContext(mainContext);
  const t = useTranslate();
  const [nights, setNights] = useState([]);

  useEffect(() => {
    const fetchnights = async () => {
      // try {
      //   const { data } = await getService.getNights(6);
      //   setNights(
      //     data || locale == "en" ? nightsEn : nightsAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch nights:", err);
      //   setNights(locale == "en" ? nightsEn : nightsAr);
      // }
      setNights(locale == "en" ? nightsEn : nightsAr);
    };
    fetchnights();
  }, [locale]);

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
        {nights.slice(0, 20).map((night) => (
          <CardItem key={night.id} item={night} type="night" />
        ))}
      </div>
    </div>
  );
}

export default Nights;