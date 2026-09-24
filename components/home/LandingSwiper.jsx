"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { slides } from "@/data";
import { mainContext } from "@/Contexts/mainContext";
import "swiper/css";
import "swiper/css/effect-fade";

function LandingSwiper() {
  const { locale } = useContext(mainContext);
  const landingRef = useRef(null);
  const [overlayHeight, setOverlayHeight] = useState(0);

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
    const nextElem = document.querySelector(".categories") || document.querySelector("main");
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={landingRef} className="landing">
      <Swiper
        key={locale}
        dir={locale === "AR" ? "rtl" : "ltr"}
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        speed={2000}
        autoplay={{ delay: 500000, disableOnInteraction: false }}
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.link} className="slide-link">
              <Image src={slide?.image} fill alt={``}></Image>
              <div className="slide-content">
                <span>{slide.small[locale]}</span>
                <h1>{slide.title[locale]}</h1>
                <h2>{slide.paragraph[locale]}</h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <span
        className="landing-overlay"
        style={{ height: overlayHeight ? `${overlayHeight}px` : undefined }}
      />

      <div className="scroll-indicator" onClick={handleScrollDown} role="button" aria-label="Scroll down">
        <span className="scroll-text">SCROLL</span>
        <div className="scroll-mouse">
          <div className="scroll-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default LandingSwiper;
