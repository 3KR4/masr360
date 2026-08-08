"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { getAll as getGovernorates } from "@/services/govenorates/govenorates.service";
import { mainContext } from "@/Contexts/mainContext";

function Governorates() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [governorates, setgovernorates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchgovernorates = async () => {
      setLoading(true);
      try {
        const { governorates } = await getGovernorates("", 1, 6, locale);
        setgovernorates(governorates || []);
      } catch (err) {
        console.error("Failed to fetch governorates:", err);
        setgovernorates([]);
      } finally {
        setLoading(false);
      }
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", gridColumn: "1 / -1" }}>
            <p>{t.dashboard.forms.loading || "Loading..."}</p>
          </div>
        ) : (
          governorates.map((gov) => (
            <CardItem key={gov.id} item={gov} type="gov" />
          ))
        )}
      </div>
    </div>
  );
}

export default Governorates;
