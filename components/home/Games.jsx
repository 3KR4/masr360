"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import "@/styles/pages/games.css";

import Image from "next/image";
import CardItem from "@/components/CardItem";
import useTranslate from "@/Contexts/useTranslation";
import { gamesEn, gamesAr } from "@/data";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCreative } from "swiper/modules";
import SwiperCore from "swiper";
import {
  FaArrowRight,
  FaArrowLeft,
  FaMapLocationDot,
  FaCompass,
  FaTrophy,
} from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-creative";

function Games() {
  const { screenSize, locale } = useContext(mainContext);
  const t = useTranslate();
  const [games, setGames] = useState([]);
  const swiperRef = useRef(null);

  SwiperCore.use([Autoplay, Pagination, EffectCreative]);

  useEffect(() => {
    const fetchgames = async () => {
      setGames(locale === "EN" ? gamesEn : gamesAr);
    };
    fetchgames();
  }, [locale]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.pagination.el = ".games-pagination";
      swiperRef.current.swiper.pagination.init();
      swiperRef.current.swiper.pagination.render();
      swiperRef.current.swiper.pagination.update();
    }
  }, [screenSize, games]);

  if (games.length < 2) return null;

  const renderExploreMoreCard = () => (
    <div className="card explore-more-card">
      <div className="image-side">
        <Image src="/more-games.png" alt="More Adventures" fill />
      </div>

      <div className="content-side">
        <div className="main-info">
          <h2 className="banner-title">
            <span>
              {t.sectionsTitles.explore_games.exploreMoreTitleLine1 ||
                (locale === "AR" ? "هل أنت مستعد لـ" : "READY FOR YOUR NEXT")}
            </span>
            <strong className="highlight">
              {t.sectionsTitles.explore_games.exploreMoreTitleLine2 ||
                (locale === "AR" ? "مغامرتك القادمة؟" : "ADVENTURE?")}
            </strong>
          </h2>
          <p className="banner-desc">
            {t.sectionsTitles.explore_games.exploreMoreSub ||
              (locale === "AR"
                ? "اكتشف المزيد من التجارب التي لا تُنسى في جميع أنحاء مصر. من العجائب القديمة إلى الملاذات الحديثة — هناك الكثير لاستكشافه."
                : "Discover more unforgettable experiences across Egypt. From ancient wonders to modern escapes — there's so much more to explore.")}
          </p>
          <Link href="/games" className="main-button explore-btn back-light-animation">
            {t.sectionsTitles.explore_games.exploreMoreBtn ||
              (locale === "AR" ? "استكشف الكل" : "EXPLORE ALL")}{" "}
            {locale === "AR" ? <FaArrowLeft /> : <FaArrowRight />}
          </Link>
        </div>

        <div className="features-row">
          <div className="feature-item">
            <FaMapLocationDot className="feature-icon" />
            <span>
              {t.sectionsTitles.explore_games.feature1 ||
                (locale === "AR" ? "أماكن أكثر" : "MORE PLACES")}
            </span>
          </div>
          <div className="divider" />
          <div className="feature-item">
            <FaCompass className="feature-icon" />
            <span>
              {t.sectionsTitles.explore_games.feature2 ||
                (locale === "AR" ? "تجارب جديدة" : "NEW EXPERIENCES")}
            </span>
          </div>
          <div className="divider" />
          <div className="feature-item">
            <FaTrophy className="feature-icon" />
            <span>
              {t.sectionsTitles.explore_games.feature3 ||
                (locale === "AR" ? "الكل في مكان واحد" : "ALL IN ONE PLACE")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="games">
      <div className="games-banner-holder container">
        {renderExploreMoreCard()}
      </div>

      {screenSize !== "small" ? (
        <div className="games-swiper-holder fluid-container">
          <Swiper
            key={locale}
            dir={locale === "AR" ? "rtl" : "ltr"}
            ref={swiperRef}
            direction="vertical"
            modules={[Autoplay, Pagination, EffectCreative]}
            effect="creative"
            creativeEffect={{
              limitProgress: 2,
              shadowPerProgress: false,
              prev: {
                shadow: false,
                translate: [0, "38%", -50],
                scale: 0.8,
                opacity: 0,
              },
              next: {
                shadow: false,
                translate: [0, "38%", -50],
                scale: 0.8,
                opacity: 0.85,
              },
            }}
            slidesPerView={1}
            grabCursor={true}
            loop={true}
            speed={800}
            pagination={{
              el: ".games-pagination",
              clickable: true,
            }}
            className="games-swiper vertical-stacked-swiper"
          >
            {games.map((game) => (
              <SwiperSlide key={game.id}>
                <CardItem item={game} type="game" />
              </SwiperSlide>
            ))}
          </Swiper>

          <ul className="swiper-pagination custom-pagination backhome games-pagination"></ul>
        </div>
      ) : (
        <div className="grid-holder container">
          {games.map((game) => (
            <CardItem key={game.id} item={game} type="game" />
          ))}
        </div>
      )}
    </div>
  );
}

export default Games;
