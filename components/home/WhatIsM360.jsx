"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useTranslate from "@/Contexts/useTranslation";
import { mainContext } from "@/Contexts/mainContext";
import {
  FaMapLocationDot,
  FaLocationDot,
  FaLayerGroup,
  FaInfinity,
  FaCompass,
  FaGamepad,
  FaCoins,
  FaTrophy,
  FaGift,
  FaGlobe,
  FaAward,
  FaBagShopping,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa6";

// Section 1: What Is M360 (Identity, Formula, Stats & Positioning)
function WhatIsM360Intro() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const data = t.sectionsTitles?.what_is_m360 || {};

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 4000;
    const steps = 80;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCount1(Math.round(easeProgress * 27));
      setCount2(Math.round(easeProgress * 1000));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="what-is-m360">
      <div className="container holder">
        {/* Top Tag Header */}
        <div className="top-tag">
          <hr />
          <span>
            {data.tag || (locale === "AR" ? "ما هو مصر 360؟" : "WHAT IS M360?")}
          </span>
          <hr />
        </div>

        {/* Hero Title */}
        <h2 className="hero-title">
          <span className="line1">
            {data.titleLine1 ||
              (locale === "AR" ? "دولة واحدة." : "ONE COUNTRY.")}
          </span>
          <span className="line2">
            {data.titleLine2 ||
              (locale === "AR" ? "من كل الزوايا." : "EVERY ANGLE.")}
          </span>
        </h2>

        {/* Core Platform Definition */}
        <p className="description">{data.desc}</p>



        {/* Enhanced 4 Stats Row */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="icon-wrapper">
              <FaMapLocationDot />
            </div>
            <div className="stat-info">
              <span className="num">{count1}</span>
              <span className="label">
                {data.stat1Label ||
                  (locale === "AR" ? "محافظة" : "Governorates")}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="stat-item">
            <div className="icon-wrapper">
              <FaLocationDot />
            </div>
            <div className="stat-info">
              <span className="num">
                {locale === "AR"
                  ? `+${count2.toLocaleString()}`
                  : `${count2.toLocaleString()}+`}
              </span>
              <span className="label">
                {data.stat2Label ||
                  (locale === "AR" ? "مكان للاكتشاف" : "Places To Discover")}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="stat-item">
            <div className="icon-wrapper">
              <FaLayerGroup />
            </div>
            <div className="stat-info">
              <span className="num">1</span>
              <span className="label">
                {data.stat3Label ||
                  (locale === "AR" ? "منصة متكاملة" : "Integrated Platform")}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="stat-item">
            <div className="icon-wrapper">
              <FaInfinity />
            </div>
            <div className="stat-info">
              <span className="num">∞</span>
              <span className="label">
                {data.stat4Label ||
                  (locale === "AR" ? "قصة للاستكشاف" : "Stories To Explore")}
              </span>
            </div>
          </div>
        </div>

        {/* Identity Formula Bar */}
        <div className="identity-formula">
          <div className="formula-pillar">
            <span className="pillar-key">{data.formulaMasr || "MASR"}</span>
            <span className="pillar-sep">=</span>
            <span className="pillar-val">
              {data.formulaMasrVal || (locale === "AR" ? "مصر" : "Egypt")}
            </span>
          </div>
          <div className="divider" />
          <div className="formula-pillar">
            <span className="pillar-key">{data.formula360 || "360°"}</span>
            <span className="pillar-sep">=</span>
            <span className="pillar-val">
              {data.formula360Val ||
                (locale === "AR"
                  ? "كل زاوية. كل محافظة. كل لحظة."
                  : "Every angle. Every governorate. Every moment.")}
            </span>
          </div>
          <div className="formula-pillar highlight">
            <span className="pillar-key">{data.formulaM360 || "M360"}</span>
            <span className="pillar-sep">=</span>
            <span className="pillar-val">
              {data.formulaM360Val ||
                (locale === "AR"
                  ? "التجربة المصرية الكاملة."
                  : "The complete Egyptian experience.")}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

// Section 2: How M360 Works (Full 6-Step Journey & Ecosystem)
function HowItWorks() {
  const t = useTranslate();
  const { locale } = useContext(mainContext);

  const data = t.sectionsTitles?.how_it_works || {};

  const steps = [
    {
      num: data.step1Num || "01",
      title:
        data.step1Title || (locale === "AR" ? "اكتشف مصر" : "DISCOVER EGYPT"),
      sub:
        data.step1Sub ||
        (locale === "AR"
          ? "استكشف محافظات مصر الـ27 واكتشف أماكن جديدة."
          : "Explore Egypt’s 27 governorates and discover new places."),
      icon: <FaCompass />,
    },
    {
      num: data.step2Num || "02",
      title:
        data.step2Title ||
        (locale === "AR" ? "العب التحديات" : "PLAY CHALLENGES"),
      sub:
        data.step2Sub ||
        (locale === "AR"
          ? "اختبر معرفتك من خلال تحديات تفاعلية ممتعة."
          : "Test your knowledge through fun interactive challenges."),
      icon: <FaGamepad />,
    },
    {
      num: data.step3Num || "03",
      title:
        data.step3Title || (locale === "AR" ? "اكسب العملات" : "EARN CREDITS"),
      sub:
        data.step3Sub ||
        (locale === "AR"
          ? "اكسب أرصدة مع الاستكشاف وإكمال التحديات."
          : "Earn credits as you explore and complete challenges."),
      icon: <FaCoins />,
    },
    {
      num: data.step4Num || "04",
      title:
        data.step4Title ||
        (locale === "AR" ? "تسلق المتصدرين" : "CLIMB LEADERBOARDS"),
      sub:
        data.step4Sub ||
        (locale === "AR"
          ? "نافس المستكشفين الآخرين واصعد في قائمة المتصدرين."
          : "Compete with fellow explorers and climb the leaderboard."),
      icon: <FaTrophy />,
    },
    {
      num: data.step5Num || "05",
      title:
        data.step5Title ||
        (locale === "AR" ? "افتح المكافآت" : "UNLOCK REWARDS"),
      sub:
        data.step5Sub ||
        (locale === "AR"
          ? "استخدم أرصدتك لفتح مكافآت وخصومات حصرية."
          : "Use your credits to unlock exclusive rewards and discounts."),
      icon: <FaGift />,
    },
    {
      num: data.step6Num || "06",
      title:
        data.step6Title ||
        (locale === "AR" ? "عِش تجربة M360" : "EXPERIENCE M360"),
      sub:
        data.step6Sub ||
        (locale === "AR"
          ? "اكتشف تجربة M360 الكاملة مع تطور رحلتك."
          : "Unlock the full M360 experience as the journey unfolds."),
      icon: <FaGlobe />,
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container holder">
        {/* Header Title Bar */}
        <div className="header-block">
          <div className="top-tag">
            <hr />
            <span>
              {data.tag ||
                (locale === "AR" ? "كيف يعمل مصر 360" : "HOW M360 WORKS")}
            </span>
            <hr />
          </div>

          <h2 className="hero-title">
            <span className="line1">
              {data.titleLine1 ||
                (locale === "AR" ? "اكتشف. العب." : "DISCOVER. PLAY.")}
            </span>
            <span className="line2">
              {data.titleLine2 ||
                (locale === "AR" ? "اكسب. استكشف." : "EARN. EXPLORE.")}
            </span>
          </h2>

          <p className="description">{data.desc}</p>
        </div>

        {/* Expanded 6-Step Journey Grid */}
        <div className="steps-journey-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="journey-step-card">
              <div
                className="bg-floating-icon"
                style={{ animationDelay: `${idx * 0.5}s` }}
              >
                {step.icon}
              </div>
              <div className="circle-icon">
                <span className="step-num-center">{step.num}</span>
              </div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-sub">{step.sub}</p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

// Main Parent Component
function WhatIsM360() {
  return (
    <div className="what-is-m360-main-wrapper back-light">
      {/* Background Eye of Horus */}
      <Image
        src="/eye of hours.png"
        alt="Eye of Horus"
        width={1000}
        height={600}
        className="bg-eye"
      />
      <WhatIsM360Intro />
      <HowItWorks />
    </div>
  );
}

export default WhatIsM360;
