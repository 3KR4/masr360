"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import { FaArrowRight } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { governoratesAr, governoratesEn } from "@/data";
import { mainContext } from "@/Contexts/mainContext";

function Governorates() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [governorates, setgovernorates] = useState([]);

  useEffect(() => {
    const fetchgovernorates = async () => {
      // try {
      //   const { data } = await getService.getGovernorates(6);
      //   setgovernorates(
      //     data || locale == "en" ? governoratesEn : governoratesAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setgovernorates(locale == "en" ? governoratesEn : governoratesAr);
      // }
      setgovernorates(locale == "en" ? governoratesEn : governoratesAr);
    };
    fetchgovernorates();
  }, [locale]);

  return (
    <div className="governorates">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.discover_egypt.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.discover_egypt.subtitle}</p>
        <Link href={`/discover`} className="main-button">
          {t.sectionsTitles.discover_egypt.btn}
        </Link>
      </div>

      <div className="grid-holder container">
        {governorates.slice(0, 6).map((gov) => (
          <CardItem key={gov.id} item={gov} type="gov" />
        ))}
      </div>
    </div>
  );
}

export default Governorates;
