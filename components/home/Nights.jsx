"use client";
import Link from "next/link";
import { nights } from "@/data";

import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
function Nights() {
const t = useTranslate();

  return (
    <div className="nights">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.masr_nights.title}
          <hr />
        </h1>
        <p className="sub-title">
          {t.sectionsTitles.masr_nights.subtitle}
        </p>
        <Link href={`/nights`} className="main-button">
          {t.sectionsTitles.masr_nights.btn}
        </Link>
      </div>

      <div className="grid-holder container">
        {nights.slice(0, 6).map((night) => (
          <CardItem key={night.id} item={night} type="night" />
        ))}
      </div>
    </div>
  );
}

export default Nights;
