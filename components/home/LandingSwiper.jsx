"use client";
import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { slides as fallbackSlides } from "@/data";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getApiSlides } from "@/services/slides/slides.service";
import "swiper/css";
import "swiper/css/effect-fade";

function getSafeText(value, locale = "EN") {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (typeof value === "object") {
    const langUpper = String(locale || "EN").toUpperCase();
    const langLower = String(locale || "EN").toLowerCase();

    const candidate =
      value[langUpper] ??
      value[langLower] ??
      value.EN ??
      value.en ??
      value.AR ??
      value.ar ??
      value.title ??
      value.smallTitle ??
      value.desc ??
      "";

    if (typeof candidate === "string") return candidate;
    if (typeof candidate === "number") return String(candidate);
    if (typeof candidate === "object" && candidate !== null) {
      return getSafeText(candidate, locale);
    }
  }

  return "";
}

function resolveSlide(slide, locale = "EN") {
  if (!slide) return null;

  const currentLang = String(locale || "EN").toUpperCase();

  let translations = slide.translations;
  if (typeof translations === "string") {
    try {
      translations = JSON.parse(translations);
    } catch {
      translations = null;
    }
  }

  const langObj =
    translations?.[currentLang] ||
    translations?.[currentLang.toLowerCase()] ||
    translations?.EN ||
    translations?.en ||
    {};

  const title =
    getSafeText(langObj?.title, currentLang) ||
    getSafeText(slide?.title, currentLang) ||
    getSafeText(translations?.title, currentLang);

  const smallTitle =
    getSafeText(langObj?.smallTitle, currentLang) ||
    getSafeText(slide?.smallTitle, currentLang) ||
    getSafeText(slide?.small, currentLang) ||
    getSafeText(translations?.smallTitle, currentLang);

  const desc =
    getSafeText(langObj?.desc, currentLang) ||
    getSafeText(slide?.desc, currentLang) ||
    getSafeText(slide?.paragraph, currentLang) ||
    getSafeText(translations?.desc, currentLang);

  const imageUrl =
    (typeof slide?.img === "object" && slide?.img?.url) ||
    (typeof slide?.image === "string" && slide.image) ||
    (typeof slide?.img === "string" && slide.img) ||
    "/Slides/slide-001.jpg";

  const link =
    (typeof slide?.link === "string" && slide.link.trim()) || "/discover";

  return {
    id: slide?._id || slide?.id || Math.random(),
    title,
    smallTitle,
    desc,
    imageUrl,
    link,
  };
}

function LandingSwiper() {
  const { locale } = useContext(mainContext);
  const landingRef = useRef(null);
  const [overlayHeight, setOverlayHeight] = useState(0);
  const [slidesData, setSlidesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSlides = async () => {
      try {
        setLoading(true);
        const res = await getApiSlides(1, 20);
        const apiSlides = res?.slides || [];

        if (isMounted) {
          const activeSlides = apiSlides.filter((s) => s?.isActive !== false);
          if (activeSlides.length > 0) {
            setSlidesData(activeSlides);
          } else {
            setSlidesData(fallbackSlides);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hero slides from API:", err);
        if (isMounted) {
          setSlidesData(fallbackSlides);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const el = landingRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.offsetHeight > 0) {
        setOverlayHeight(el.offsetHeight * 0.4);
      }
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);

    window.addEventListener("resize", updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const handleScrollDown = () => {
    const nextElem =
      document.querySelector(".categories") || document.querySelector("main");
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const rawSlides = slidesData.length > 0 ? slidesData : fallbackSlides;

  const currentSlides = useMemo(() => {
    return (rawSlides || [])
      .map((slide) => resolveSlide(slide, locale))
      .filter(Boolean);
  }, [rawSlides, locale]);

  return (
    <div ref={landingRef} className="landing">
      <Swiper
        key={`${locale}-${currentSlides.length}`}
        dir={locale === "AR" ? "rtl" : "ltr"}
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop={currentSlides.length > 1}
        speed={2000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {currentSlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <Link href={slide.link} className="slide-link">
              <Image
                src={slide.imageUrl}
                fill
                alt={slide.title || "Slide"}
                priority={index === 0}
              />
              <div className="slide-content">
                {slide.smallTitle ? <span>{slide.smallTitle}</span> : null}
                {slide.title ? <h1>{slide.title}</h1> : null}
                {slide.desc ? <h2>{slide.desc}</h2> : null}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <span
        className="landing-overlay"
        style={{ height: overlayHeight ? `${overlayHeight}px` : undefined }}
      />

      <div
        className="scroll-indicator"
        onClick={handleScrollDown}
        role="button"
        aria-label="Scroll down"
      >
        <span className="scroll-text">SCROLL</span>
        <div className="scroll-mouse">
          <div className="scroll-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default LandingSwiper;
