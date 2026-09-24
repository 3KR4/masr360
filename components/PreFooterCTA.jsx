"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import "@/styles/components/pre-footer-cta.css";

export default function PreFooterCTA() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";

  const cta = t.sectionsTitles?.support_cta || {
    title: isAr ? "هل تحتاج مساعدة في" : "NEED ASSISTANCE WITH",
    title_gold: isAr ? "رحلتك؟" : "YOUR JOURNEY?",
    subtitle: isAr
      ? "لديك سؤال أو تحتاج إلى مساعدة؟ فريق الدعم لدينا متواجد لمساعدتك وجعل تجربتك على مصر360 سلسة وممتعة."
      : "Have A Question Or Need Help? Our Support Team Is Here To Assist You And Make Your Marsr360 Experience Smooth And Enjoyable.",
    btn: isAr ? "احصل على الدعم" : "GET SUPPORT",
  };

  return (
    <section className="pre-footer-cta ">
      <div className="container cta-content">
        <h2 className="cta-title">
          {cta.title} <span className="gold-text">{cta.title_gold}</span>
        </h2>

        <p className="cta-subtitle">{cta.subtitle}</p>

        <Link href="/support" className="cta-button back-light-animation main-button">
          <span>{cta.btn}</span>
          {isAr ? <FaArrowLeft /> : <FaArrowRight />}
        </Link>
      </div>
    </section>
  );
}
