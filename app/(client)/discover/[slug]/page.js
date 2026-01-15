"use client";
import Image from "next/image";
import { governorates } from "@/data";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getService } from "@/services/api/getService";

import useTranslate from "@/Contexts/useTranslation";
export default function governorateDetails() {
  const t = useTranslate();

  const { slug } = useParams();
  const [governorate, setgovernorate] = useState(null);

  useEffect(() => {
    const GetSinglegovernorate = async () => {
      try {
        const { data } = await getService.getSingleGovernorate(slug);

        const gov = data.g;

        if (gov) {
          setgovernorate(gov);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      GetSinglegovernorate();
    }
  }, [slug]);

  return (
    <div className="discover">
      <div className="hero-image-holder fluid-container">
        <Image src={governorate?.img} fill alt={governorate?.name} />
        <div className="details">
          <h3>{governorate?.name}</h3>
          <p>{governorate?.desc}</p>
        </div>
      </div>
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.governorate_places(governorate?.name).mainTitle}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.governorate_places(governorate?.name).subTitle}
        </p>
      </div>
      {governorate?.places && (
        <DisplayContent
          type={"place"}
          isSharedData={true}
          shared={governorate?.places}
        />
      )}
    </div>
  );
}
