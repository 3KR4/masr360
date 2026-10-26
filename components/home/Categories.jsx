"use client";
import React, { useContext, useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import SwiperCore from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

import useTranslate from "@/Contexts/useTranslation";
import { getAll as getCategories } from "@/services/categories/categories.service";

const FALLBACK_CATEGORIES = [
  {
    _id: "6984eec0888f9d5d903f3a5a",
    name: "Religious",
    type: "place",
    icon: "🕌",
    translations: {
      EN: { name: "Religious" },
      AR: { name: "سياحة دينية" },
    },
  },
  {
    _id: "6984eec0888f9d5d903f3a56",
    name: "Ancient Egypt",
    type: "place",
    icon: "🏺",
    translations: {
      EN: { name: "Ancient Egypt" },
      AR: { name: "مصر القديمة" },
    },
  },
  {
    _id: "6984eec0888f9d5d903f3a57",
    name: "Beaches",
    type: "place",
    icon: "🏖️",
    translations: {
      EN: { name: "Beaches" },
      AR: { name: "الشواطئ" },
    },
  },
  {
    _id: "6984eec0888f9d5d903f3a5d",
    name: "Shopping",
    type: "place",
    icon: "🛍️",
    translations: {
      EN: { name: "Shopping" },
      AR: { name: "التسوق" },
    },
  },
  {
    _id: "6a7f5fe9869e39f77392685e",
    name: "Nature",
    type: "place",
    icon: "🌿",
    translations: {
      EN: { name: "Nature" },
      AR: { name: "طبيعة" },
    },
  },
  {
    _id: "6a7f67ae869e39f773926ab3",
    name: "Art & Culture",
    type: "place",
    icon: "🎨",
    translations: {
      EN: { name: "Art & Culture" },
      AR: { name: "الفنون والثقافة" },
    },
  },
];

const CATEGORY_IMAGES_MAP = {
  // By ID
  "6984eec0888f9d5d903f3a5a": "/categories/Religious.jpg",
  "6984eec0888f9d5d903f3a56": "/categories/Ancient Egypt.jpg",
  "6984eec0888f9d5d903f3a57": "/categories/beaches.jpg",
  "6984eec0888f9d5d903f3a5d": "/categories/Shopping.jpg",
  "6a7f5fe9869e39f77392685e": "/categories/Nature.jpg",
  "6a7f67ae869e39f773926ab3": "/categories/Museums.jpg",

  // By Name (English lowercase)
  "religious": "/categories/Religious.jpg",
  "ancient egypt": "/categories/Ancient Egypt.jpg",
  "beaches": "/categories/beaches.jpg",
  "beach": "/categories/beaches.jpg",
  "shopping": "/categories/Shopping.jpg",
  "nature": "/categories/Nature.jpg",
  "art & culture": "/categories/Museums.jpg",
  "art and culture": "/categories/Museums.jpg",
  "museums": "/categories/Museums.jpg",

  // By Arabic Name
  "سياحة دينية": "/categories/Religious.jpg",
  "مصر القديمة": "/categories/Ancient Egypt.jpg",
  "الشواطئ": "/categories/beaches.jpg",
  "شواطئ": "/categories/beaches.jpg",
  "التسوق": "/categories/Shopping.jpg",
  "تسوق": "/categories/Shopping.jpg",
  "طبيعة": "/categories/Nature.jpg",
  "الفنون والثقافة": "/categories/Museums.jpg",
  "فنون وثقافة": "/categories/Museums.jpg",
};

const getCategoryImage = (cat) => {
  if (!cat) return "/categories/Nature.jpg";
  const id = cat._id || cat.id;
  if (id && CATEGORY_IMAGES_MAP[id]) return CATEGORY_IMAGES_MAP[id];

  const enName = (cat.translations?.EN?.name || cat.translations?.en?.name || cat.name || "")
    .trim()
    .toLowerCase();
  if (CATEGORY_IMAGES_MAP[enName]) return CATEGORY_IMAGES_MAP[enName];

  const arName = (cat.translations?.AR?.name || cat.translations?.ar?.name || "")
    .trim();
  if (CATEGORY_IMAGES_MAP[arName]) return CATEGORY_IMAGES_MAP[arName];

  // Fallback checks by partial keyword
  if (enName.includes("beach")) return "/categories/beaches.jpg";
  if (enName.includes("egypt")) return "/categories/Ancient Egypt.jpg";
  if (enName.includes("relig")) return "/categories/Religious.jpg";
  if (enName.includes("shop")) return "/categories/Shopping.jpg";
  if (enName.includes("nature")) return "/categories/Nature.jpg";
  if (enName.includes("art") || enName.includes("culture") || enName.includes("museum")) {
    return "/categories/Museums.jpg";
  }

  return "/categories/Nature.jpg";
};

function Categories() {
  const t = useTranslate();
  SwiperCore.use([Autoplay, EffectFade, Pagination]);

  const { screenSize, locale } = useContext(mainContext);
  const swiperRef = useRef(null);

  const [items, setItems] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await getCategories({
          type: "place",
          lang: locale,
        });

        const rawCategories =
          Array.isArray(res.data?.data?.data)
            ? res.data.data.data
            : Array.isArray(res.data?.data)
              ? res.data.data
              : Array.isArray(res.data)
                ? res.data
                : [];

        const parentCategories = rawCategories.filter((cat) => !cat.parent);

        if (isMounted && parentCategories.length > 0) {
          setItems(parentCategories);
        }
      } catch (error) {
        console.error("Failed to fetch place categories for home swiper:", error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.params.pagination.el = ".custom-pagination";
      swiperRef.current.swiper.pagination.init();
      swiperRef.current.swiper.pagination.render();
      swiperRef.current.swiper.pagination.update();
    }
  }, [screenSize, items, locale]);

  const getCategoryName = (cat) => {
    if (!cat) return "";
    if (locale === "AR") {
      return (
        cat.translations?.AR?.name ||
        cat.translations?.ar?.name ||
        cat.name ||
        ""
      );
    }
    return (
      cat.translations?.EN?.name ||
      cat.translations?.en?.name ||
      cat.name ||
      ""
    );
  };

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
        key={`${locale}-${items.length}`}
        dir={locale === "AR" ? "rtl" : "ltr"}
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={4.4}
        spaceBetween={15}
        loop={items.length >= 4}
        speed={2000}
        // autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          el: ".custom-pagination", // نربطها بعنصر خارجي
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
          },
          650: {
            slidesPerView: 1.5,
          },
          1024: {
            slidesPerView: 2,
          },
          1350: {
            slidesPerView: 2.5,
          },
          1520: {
            slidesPerView: 3,
          },
          1650: {
            slidesPerView: 3.5,
          },
        }}
        className="categories-swiper"
      >
        {items.map((cat) => {
          const catId = cat._id || cat.id;
          const catName = getCategoryName(cat);
          const imgSrc = getCategoryImage(cat);

          return (
            <SwiperSlide key={catId}>
              <Link
                href={`/places?category=${catId}&catLabel=${encodeURIComponent(catName)}`}
                className="box"
              >
                <Image
                  src={imgSrc}
                  alt={catName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="text-holder">
                  <h2 className="name">{catName}</h2>
                  {/* <span className="places-count">{cat.count || 0} places</span> */}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ✅ الباجنيشن الخارجي */}
      <ul className="swiper-pagination custom-pagination backhome"></ul>
    </div>
  );
}

export default Categories;
