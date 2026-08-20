"use client";
import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import { mainContext } from "@/Contexts/mainContext";
import { getAll as getEvents } from "@/services/events/events.service";

import "swiper/css";
import "swiper/css/effect-fade";
import CardItem from "@/components/CardItem";

import useTranslate from "@/Contexts/useTranslation";
function Events() {
  const { screenSize, locale } = useContext(mainContext);

  const t = useTranslate();
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const result = await getEvents("", 1, 20, locale);
      setEvents(result.events || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
    }
  }, [locale]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  SwiperCore.use([Autoplay, EffectFade, Pagination]);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.pagination.el = ".custom-paginations";
      swiperRef.current.swiper.pagination.init();
      swiperRef.current.swiper.pagination.render();
      swiperRef.current.swiper.pagination.update();
    }
  }, [screenSize]);

  if (events.length < 3) return null;

  return (
    <div className="events">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          {t.sectionsTitles.upcoming_events.title}
          <hr />
        </h1>
        <p className="sub-title">{t.sectionsTitles.upcoming_events.subtitle}</p>
        <Link href={`/events`} className="main-button">
          {t.sectionsTitles.upcoming_events.btn}
        </Link>
      </div>

      <Swiper
        key={locale}
        dir={locale === "AR" ? "rtl" : "ltr"}
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={5}
        spaceBetween={11}
        loop={true}
        speed={2000}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          el: ".custom-paginations",
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1400: {
            slidesPerView: 3,
          },
        }}
        className="categories-swiper"
      >
        {events.map((item) => (
          <SwiperSlide key={item.id}>
            <CardItem item={item} type={"event"} />
          </SwiperSlide>
        ))}
      </Swiper>
      <ul className="swiper-pagination custom-paginations backhome"></ul>
    </div>
  );
}

export default Events;
