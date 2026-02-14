"use client";
import Image from "next/image";
import { governoratesEn, governoratesAr } from "@/data";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import { useParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { mainContext } from "@/Contexts/mainContext";

import useTranslate from "@/Contexts/useTranslation";

export default function GovernorateDetails() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);

  const { slug } = useParams();
  const [governorate, setgovernorate] = useState({});

  useEffect(() => {
    // const GetSinglegovernorate = async () => {
    //   try {
    //     const { data } = await getService.getSingleGovernorate(slug);

    //     const gov = data.g;

    //     if (gov) {
    //       setgovernorate(gov);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    if (slug) {
      // GetSinglegovernorate();
      const governorates = locale == "en" ? governoratesEn : governoratesAr;
      setgovernorate(governorates?.find((X) => X.id == slug));
    }
  }, [slug, locale]);

  return (
    <div className="discover">
      <div className="hero-image-holder fluid-container">
        <Image src={governorate?.image} fill alt={governorate?.name} />
        <div className="details column">
          <h3>{governorate?.name}</h3>
          <p>{governorate?.description}</p>
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
        <DisplayContent
          type={"place"}
          isSharedData={true}
          shared={governorate?.id}
        />
    </div>
  );
}
