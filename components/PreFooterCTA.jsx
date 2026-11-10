"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

// pages where a "Get support" banner would point at the page you're already on
const HIDDEN_ON = ["/support", "/support-success"];
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import "@/styles/components/pre-footer-cta.css";

export default function PreFooterCTA() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";
  const pathname = usePathname();

  const cta = t.sectionsTitles?.support_cta || {
    title: isAr ? "هل تحتاج مساعدة في" : "NEED ASSISTANCE WITH",
    title_gold: isAr ? "رحلتك؟" : "YOUR JOURNEY?",
    subtitle: isAr
      ? "لديك سؤال أو تحتاج إلى مساعدة؟ فريق الدعم لدينا متواجد لمساعدتك وجعل تجربتك على مصر360 سلسة وممتعة."
      : "Have A Question Or Need Help? Our Support Team Is Here To Assist You And Make Your Marsr360 Experience Smooth And Enjoyable.",
    btn: isAr ? "احصل على الدعم" : "GET SUPPORT",
  };

  if (HIDDEN_ON.some((p) => pathname?.startsWith(p))) return null;

  return (
    <section className="pre-footer-cta">
      <div className="cta-poster">
        <div className="container cta-inner">
          <div className="cta-content">
            <h2 className="cta-title">
              {cta.title} <span className="gold-text">{cta.title_gold}</span>
            </h2>

            <p className="cta-subtitle">{cta.subtitle}</p>

            <Link href="/support" className="cta-button main-button secondary">
              <span>{cta.btn}</span>
              {isAr ? <FaArrowLeft /> : <FaArrowRight />}
            </Link>
          </div>

          <div className="cta-falcon" aria-hidden="true">
            {/* the rotating sun is centred on the falcon: it sits in the hollow ring */}
            <span className="cta-sun" />
            <Image
              src="/brand/mascot/falcon-happy.webp"
              alt=""
              width={600}
              height={633}
              sizes="(max-width: 768px) 140px, 260px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
