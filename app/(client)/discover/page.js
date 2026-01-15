"use client";
import Navigations from "@/components/Navigations";
import DisplayContent from "@/components/DisplayContent";
import "@/styles/pages/discover.css";

import useTranslate from "@/Contexts/useTranslation";
export default function DiscoverContent() {
  const t = useTranslate();

  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.discover_egypt_page.mainTitle}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.discover_egypt_page.subTitle}
        </p>
      </div>

      <Navigations
        items={[
          {
            name: t.sideNav.governorates,
            href: "",
          },
        ]}
      />
      <DisplayContent type={"gov"} />
    </div>
  );
}
