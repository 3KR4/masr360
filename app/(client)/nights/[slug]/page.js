"use client";
import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@/styles/pages/singel-details.css";
import Image from "next/image";
import Navigations from "@/components/Navigations";
import { mainContext } from "@/Contexts/mainContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import "swiper/css";
import "swiper/css/effect-fade";
import {
  governoratesEn,
  governoratesAr,
  nightsEn,
  nightsAr,
  reviews,
} from "@/data";
import PlaceTickets from "@/components/PlaceTickets";
import useTranslate from "@/Contexts/useTranslation";
import ReviewSection from "@/components/reviews/ReviewSection";

export default function ProductDetails() {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { slug } = useParams();

  SwiperCore.use([Autoplay, EffectFade, Navigation]);

  const [night, setNights] = useState(null);

  useEffect(() => {
    if (slug) {
      const nights = locale === "en" ? nightsEn : nightsAr;
      setNights(nights.find((x) => x.id == slug));
    }
  }, [slug, locale]);

  const nightGov =
    locale === "en"
      ? governoratesEn.find((x) => x.id == night?.governorate?.id)
      : governoratesAr.find((x) => x.id == night?.governorate?.id);

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        {/* HERO */}
        <div className="hero-image-holder">
          {night?.images?.[0] && (
            <Image src={night.images[0]} alt={night.name} fill />
          )}
          {screenSize !== "small" && (
            <div className="details">
              <h3 className="ellipsis">{night?.name}</h3>
            </div>
          )}
        </div>

        {/* NAV */}
        <Navigations
          items={[
            { name: t.sectionsTitles.masr_nights.title, href: "/nights" },
            { name: t.dashboard.tables.placeDetails, href: "" },
          ]}
          container="main"
        />

        {/* DETAILS */}
        <div className="holds">
          <div className="details-holder">
            {screenSize === "small" && (
              <div className="details">
                <h3>{night?.name}</h3>
              </div>
            )}
            <p className="description">{night?.description}</p>
          </div>
        </div>

        {/* IMAGES */}
        <div className="images-swiper">
          <div className="top">
            <h4>{t.singelPages.place_images}</h4>
            {night?.images?.length > 2 && (
              <div className="navigation">
                <button className="custom-prev">
                  <IoIosArrowBack />
                </button>
                <button className="custom-next">
                  <IoIosArrowForward />
                </button>
              </div>
            )}
          </div>

          <Swiper
            key={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            modules={[Autoplay, EffectFade]}
            slidesPerView={2}
            spaceBetween={8}
            loop={true}
            speed={1000}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            className="categories-swiper"
            breakpoints={{
              0: { slidesPerView: 1 },
              630: { slidesPerView: 1.3 },
              768: { slidesPerView: 1.5 },
              992: { slidesPerView: 2 },
            }}
          >
            {night?.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <Image src={img} alt={`place img - ${index}`} fill />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* LOCATION */}
        <div className="location">
          <div className="top">
            <h4>
              {t.singelPages.locationIn} {nightGov?.name}
            </h4>
            <div className="actions">
              <div className="hold">
                <button className="main-button forFavoriet">
                  {t.singelPages.view_in_google_maps}
                </button>
                <button className="main-button forFavoriet">
                  {t.actions.copy_link}
                </button>
              </div>
            </div>
          </div>

          <div className="i-frame">
            <iframe
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map"
              src={night?.location?.iFrame}
            ></iframe>
          </div>
        </div>
        <ReviewSection reviews={reviews[0]} />
      </div>
    </div>
  );
}
