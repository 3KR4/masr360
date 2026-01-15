"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";

import useTranslate from "@/Contexts/useTranslation";
export default function DiscoverContent() {
  const t = useTranslate();

  return (
    <div className="discover">


      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.discover_places.mainTitle}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.discover_places.subTitle}</p>
      </div>

     

      <Navigations
        items={[
          {
            name: "places",
            href: "",
          },
        ]}
      />

      <DisplayContent type={"place"} />
    </div>
  );
}
