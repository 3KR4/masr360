"use client";
import Image from "next/image";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import { useParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";
import { getOne } from "@/services/govenorates/govenorates.service";

import useTranslate from "@/Contexts/useTranslation";

export default function GovernorateDetails() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);

  const { slug } = useParams();
  const [governorate, setgovernorate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const GetSinglegovernorate = async () => {
      setLoading(true);
      try {
        const res = await getOne(slug);
        const gov = res?.data?.governorate || null;
        setgovernorate(gov);
      } catch (error) {
        console.log(error);
        setgovernorate(null);
      } finally {
        setLoading(false);
      }
    };
    GetSinglegovernorate();
  }, [slug]);

  const govName =
    governorate?.translations?.[locale]?.name ||
    governorate?.name ||
    "";
  const govDesc =
    governorate?.translations?.[locale]?.desc ||
    governorate?.description ||
    governorate?.desc ||
    "";

  return (
    <div className="discover">
      <div className="hero-image-holder fluid-container">
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
            }}
          >
            <p>{t.dashboard.forms.loading || "Loading..."}</p>
          </div>
        ) : (
          governorate && (
            <>
              <Image
                src={governorate?.image || "/images/dashboard-product-placeholder.svg"}
                fill
                alt={govName}
              />
              <div className="details column">
                <h3>{govName}</h3>
                <p>{govDesc}</p>
              </div>
            </>
          )
        )}
      </div>
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.governorate_places(govName).mainTitle}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.governorate_places(govName).subTitle}
        </p>
      </div>
      <DisplayContent
        type={"place"}
        isSharedData={true}
        shared={governorate?.id}
      />
    </div>
  );
}
