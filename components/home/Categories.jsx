"use client";
import React, { useContext, useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

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

  const [active, setActive] = useState(0);

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

  // Swiper needs ≥ 8 slides to loop with 3 centred cards + 2 peeking ones.
  // Repeat the list as needed; the bullets below still map to real categories.
  const MIN_LOOP_SLIDES = 10;
  const repeat = items.length ? Math.max(1, Math.ceil(MIN_LOOP_SLIDES / items.length)) : 1;
  const loopSlides = Array.from({ length: repeat }, (_, r) =>
    items.map((cat) => ({ cat, key: `${cat._id || cat.id}-${r}` })),
  ).flat();

  const goTo = (i) => {
    const sw = swiperRef.current?.swiper;
    if (sw) sw.slideToLoop(i);
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
        modules={[Autoplay]}
        centeredSlides
        loop={items.length > 1}
        speed={1100}
        grabCursor
        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSlideChange={(sw) => setActive(sw.realIndex % Math.max(1, items.length))}
        breakpoints={{
          // 3 main cards in the middle + a slice of one card at each screen edge
          0: { slidesPerView: 1.35, spaceBetween: 12 },
          650: { slidesPerView: 2.4, spaceBetween: 14 },
          1024: { slidesPerView: 3.5, spaceBetween: 18 },
          1600: { slidesPerView: 3.6, spaceBetween: 22 },
        }}
        className="categories-swiper"
      >
        {loopSlides.map(({ cat, key }) => {
          const catId = cat._id || cat.id;
          const catName = getCategoryName(cat);
          const imgSrc = getCategoryImage(cat);

          return (
            <SwiperSlide key={key}>
              <Link
                href={`/places?category=${catId}&catLabel=${encodeURIComponent(catName)}`}
                className="box"
              >
                <Image
                  src={imgSrc}
                  alt={catName}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 30vw"
                />
                <span className="cat-arrow" aria-hidden="true">
                  {locale === "AR" ? <FaArrowLeft /> : <FaArrowRight />}
                </span>
                <div className="text-holder">
                  <h2 className="name">{catName}</h2>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <ul className="swiper-pagination custom-pagination backhome" role="tablist">
        {items.map((cat, i) => (
          <li key={cat._id || cat.id || i}>
            <button
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={getCategoryName(cat)}
              className={`swiper-pagination-bullet ${active === i ? "swiper-pagination-bullet-active" : ""}`}
              onClick={() => goTo(i)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
