"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaArrowLeft,
  FaLock,
  FaHourglassHalf,
  FaCircleCheck,
} from "react-icons/fa6";
import { mainContext } from "@/Contexts/mainContext";

const BADGES = [
  { key: "cairo", en: "Cairo", ar: "القاهرة", live: true },
  { key: "giza", en: "Giza", ar: "الجيزة" },
  { key: "alexandria", en: "Alexandria", ar: "الإسكندرية" },
  { key: "luxor", en: "Luxor", ar: "الأقصر" },
  { key: "aswan", en: "Aswan", ar: "أسوان" },
  { key: "port-said", en: "Port Said", ar: "بورسعيد" },
];

const TOTAL = 27;
const LOCKED_PREVIEW = 2;

export default function BadgeQuest() {
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copy = isAr
    ? {
        tag: "مهمة الشارات",
        title1: "اجمع",
        title2: "مصر كلها",
        desc: "كل محافظة لها شارة. استكشف، العب التحديات، وافتح شارات المحافظات الـ27 واحدة تلو الأخرى.",
        bubble: "يلا بينا! أول شارة مستنياك",
        progress: "شارة متاحة الآن",
        locked: "مقفولة",
        live: "متاحة",
        soon: "بتتجهز",
        cta: "ابدأ المغامرة",
      }
    : {
        tag: "BADGE QUEST",
        title1: "COLLECT",
        title2: "ALL OF EGYPT",
        desc: "Every governorate has its own badge. Explore, beat challenges and unlock all 27 — one city at a time.",
        bubble: "Yalla! Your first badge is waiting.",
        progress: "badge live now",
        locked: "Locked",
        live: "Live",
        soon: "Preparing",
        cta: "START THE QUEST",
      };

  const liveCount = BADGES.filter((b) => b.live).length;
  const pct = Math.max(3, Math.round((liveCount / TOTAL) * 100));

  return (
    <section
      ref={ref}
      className={`badge-quest ${inView ? "in-view" : ""}`}
      aria-labelledby="badge-quest-title"
    >
      <div className="container badge-quest__inner">
        <div className="badge-quest__copy">
          <span className="brand-eyebrow">
            <i aria-hidden="true" />
            {copy.tag}
          </span>
          <h2 id="badge-quest-title" className="badge-quest__title">
            <span>{copy.title1}</span>
            <span className="accent">{copy.title2}</span>
          </h2>
          <p className="badge-quest__desc">{copy.desc}</p>

          <div
            className="quest-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL}
            aria-valuenow={liveCount}
            aria-label={copy.progress}
          >
            <div className="quest-progress__meta">
              <strong>
                {liveCount}
                <small>/{TOTAL}</small>
              </strong>
              <span>{copy.progress}</span>
            </div>
            <div className="quest-progress__track">
              <span style={{ "--pct": `${pct}%` }} />
              {Array.from({ length: TOTAL - 1 }).map((_, i) => (
                <i key={i} style={{ left: `${((i + 1) / TOTAL) * 100}%` }} />
              ))}
            </div>
          </div>

          <Link href="/games" className="main-button back-light-animation">
            {copy.cta}
            {isAr ? <FaArrowLeft /> : <FaArrowRight />}
          </Link>
        </div>

        <div className="badge-quest__board">
          <div className="badge-quest__mascot">
            <div className="speech-bubble">{copy.bubble}</div>
            <Image
              src="/brand/mascot/falcon.webp"
              alt={isAr ? "صقر مصر 360" : "The MASR 360 falcon explorer"}
              width={900}
              height={1055}
              sizes="(max-width: 768px) 40vw, 260px"
            />
          </div>

          <ul className="badge-grid">
            {BADGES.map((b, i) => (
              <li
                key={b.key}
                className={`badge-tile ${b.live ? "is-live" : "is-soon"}`}
                style={{ "--i": i }}
                tabIndex={b.live ? 0 : -1}
                aria-label={`${isAr ? b.ar : b.en} — ${b.live ? copy.live : copy.soon}`}
              >
                <span className="badge-tile__shine" aria-hidden="true" />
                <span className="badge-status" aria-hidden="true">
                  {b.live ? <FaCircleCheck /> : <FaHourglassHalf />}
                  {b.live ? copy.live : copy.soon}
                </span>
                <Image
                  src={`/brand/badges/${b.key}.webp`}
                  alt={isAr ? b.ar : b.en}
                  width={420}
                  height={500}
                  sizes="140px"
                />
              </li>
            ))}
            {Array.from({ length: LOCKED_PREVIEW }).map((_, i) => (
              <li
                key={`locked-${i}`}
                className="badge-tile locked"
                style={{ "--i": BADGES.length + i }}
                aria-label={copy.locked}
              >
                <span className="locked-disc">
                  <FaLock />
                </span>
                <span className="locked-label">{copy.locked}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
