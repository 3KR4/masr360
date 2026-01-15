"use client";
import React, { useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import SwiperCore from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

import useTranslate from "@/Contexts/useTranslation";
function Categories() {
  const t = useTranslate();
  SwiperCore.use([Autoplay, EffectFade, Pagination]);

  const { screenSize, locale } = useContext(mainContext);
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.pagination.el = ".custom-pagination";
      swiperRef.current.swiper.pagination.init();
      swiperRef.current.swiper.pagination.render();
      swiperRef.current.swiper.pagination.update();
    }
  }, [screenSize]);

  return (
    <div className="categories">
      <div className="title-holder">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.categories.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.categories.subtitle}</p>
      </div>

      <Swiper
        key={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={5}
        spaceBetween={9}
        loop={true}
        speed={2000}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          el: ".custom-pagination", // نربطها بعنصر خارجي
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.5,
          },
          650: {
            slidesPerView: 2,
          },
          800: {
            slidesPerView: 2.5,
          },
          1024: {
            slidesPerView: 3,
          },
          1350: {
            slidesPerView: 3.5,
          },
          1520: {
            slidesPerView: 4,
          },
          1650: {
            slidesPerView: 4.5,
          },
        }}
        className="categories-swiper"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link href={`/places?cat=${cat?.id}`} className="box">
              <Image src={cat.image} alt={cat.name} fill />
              <div className="text-holder">
                <h2 className="name">{cat.name}</h2>
                <span className="places-count">{cat.count} places</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ الباجنيشن الخارجي */}
      <ul className="swiper-pagination custom-pagination backhome"></ul>
    </div>
  );
}

export default Categories;
