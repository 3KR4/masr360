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
import { governoratesEn, governoratesAr, placesEn, placesAr } from "@/data";
import PlaceTickets from "@/components/PlaceTickets";
import useTranslate from "@/Contexts/useTranslation";

export default function ProductDetails() {
  const t = useTranslate();
  const { screenSize, locale } = useContext(mainContext);
  const { slug } = useParams();

  SwiperCore.use([Autoplay, EffectFade, Navigation]);

  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (slug) {
      const places = locale === "en" ? placesEn : placesAr;
      setPlace(places.find((x) => x.id == slug));
    }
  }, [slug, locale]);

  const placeGov =
    locale === "en"
      ? governoratesEn.find((x) => x.id === place?.governorate?.id)
      : governoratesAr.find((x) => x.id === place?.governorate?.id);

  return (
    <div className="single-page forPlace container">
      <div className="holder big-holder">
        {/* HERO */}
        <div className="hero-image-holder">
          {place?.images?.[0] && (
            <Image src={place.images[0]} alt={place.name} fill />
          )}
          {screenSize !== "small" && (
            <div className="details">
              <h3 className="ellipsis">{place?.name}</h3>
              {place?.tickets?.type === "free" && (
                <div className="free">{t.singelPages.freeToVisit}</div>
              )}
            </div>
          )}
        </div>

        {/* NAV */}
        <Navigations
          items={[
            { name: t.sideNav.places, href: "/places" },
            { name: t.dashboard.tables.placeDetails, href: "" },
          ]}
          container="main"
        />

        {/* DETAILS */}
        <div className="holds">
          <div className="details-holder">
            {screenSize === "small" && (
              <div className="details">
                <h3>{place?.name}</h3>
                {place?.tickets?.type === "free" && (
                  <div className="free">{t.singelPages.freeToVisit}</div>
                )}
              </div>
            )}
            <p className="description">{place?.description}</p>
          </div>

          {/* TICKETS */}
          <PlaceTickets tickets={place?.tickets} />
        </div>

        {/* IMAGES */}
        <div className="images-swiper">
          <div className="top">
            <h4>{t.singelPages.place_images}</h4>
            {place?.images?.length > 2 && (
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
            {place?.images?.map((img, index) => (
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
              {t.singelPages.locationIn} {placeGov?.name}
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
              src={place?.location?.iFrame}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
