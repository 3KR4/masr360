"use client";
import React, { useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import { mainContext } from "@/Contexts/mainContext";
import { nights, events } from "@/data";

import "swiper/css";
import "swiper/css/effect-fade";
import CardItem from "@/components/CardItem";

function Events() {
  SwiperCore.use([Autoplay, EffectFade, Pagination]);

  const { screenSize } = useContext(mainContext);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.pagination.el = ".custom-paginations";
      swiperRef.current.swiper.pagination.init();
      swiperRef.current.swiper.pagination.render();
      swiperRef.current.swiper.pagination.update();
    }
  }, [screenSize]);

  return (
    <div className="events">
      <div className="title-holder container">
        <h1 className="main-title">
          <hr />
          upcoming events
          <hr />
        </h1>
        <p className="sub-title">
          Check out the latest upcoming events happening soon!
        </p>
        <Link href={`/nights`} className="main-button">
          Explore More
        </Link>
      </div>

      <Swiper
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
