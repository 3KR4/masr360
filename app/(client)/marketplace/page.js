"use client";
import Navigations from "@/components/Navigations";
import "@/styles/pages/discover.css";
import DisplayContent from "@/components/DisplayContent";
import useTranslate from "@/Contexts/useTranslation";

function Marketplace() {
  const t = useTranslate();
  return (
    <div className="discover">
      <div className="title-holder pages container">
        <h1 className="main-title">
          <hr />
          {t.header.marketplace}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.marketplace_page.subTitle}
        </p>
      </div>
      <Navigations
        items={[
          {
            name: t.header.marketplace,
            href: "",
          },
        ]}
      />
      <DisplayContent type={"product"} />
    </div>
  );
}
export default Marketplace;
